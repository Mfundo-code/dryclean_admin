import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
  Logo palette:
  --dark-green  : #1B3D2F
  --bright-green: #3DBE5C
  --gold        : #C9A53A
  --dark        : #1C1C1C
  --light-gray  : #F2F2EE
*/

const AvailableVacancies = ({ initialJobs = [] }) => {
  const [jobPostings, setJobPostings] = useState(initialJobs);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    cover_letter: '',
    cv: null,
    linkedin_profile: '',
    portfolio_url: '',
    job: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // NEW

  const applicationSectionRef = useRef(null);

  const DARK_GREEN   = '#1B3D2F';
  const BRIGHT_GREEN = '#3DBE5C';
  const GOLD         = '#C9A53A';
  const LIGHT_GRAY   = '#F2F2EE';
  const WHITE        = '#ffffff';

  const BASE = process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000'
    : 'https://www.dlamsoft.co.za';

  const API_JOBS  = `${BASE}/api/jobs/`;
  const API_APPLY = `${BASE}/api/apply/`;

  useEffect(() => {
    if (initialJobs.length === 0) {
      fetchJobPostings();
    } else {
      setJobPostings(initialJobs);
    }

    // Track careers page visit — same pattern as fetchJobPostings
    fetch(`${BASE}/api/track/visit/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'careers' }),
    }).catch(() => {}); // silent — never blocks the UI

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [initialJobs]);

  const fetchJobPostings = async () => {
    try {
      const response = await fetch(API_JOBS);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setJobPostings(Array.isArray(data) ? data : (data.results ?? []));
    } catch (error) {
      console.error('Error fetching job postings:', error);
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setFormData(prev => ({ ...prev, job: job.id }));
    setIsFormVisible(true);

    // Track job view — same pattern as fetchJobPostings
    fetch(`${BASE}/api/track/job-view/${job.id}/`, {
      method: 'POST',
    }).catch(() => {}); // silent — never blocks the UI

    setTimeout(() => {
      applicationSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setSelectedJob(null);
    setSubmitStatus(null);
    setShowSuccessModal(false); // also close modal if open
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (submitStatus) setSubmitStatus(null);
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, cv: e.target.files[0] }));
    if (submitStatus) setSubmitStatus(null);
  };

  const isValidUrl = (string) => {
    try { new URL(string); return true; } catch { return false; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (!formData.full_name.trim() || !formData.email.trim() || !formData.phone.trim() ||
        !formData.cover_letter.trim() || !formData.cv) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields.' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.job) {
      setSubmitStatus({ type: 'error', message: 'Please select a job position.' });
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({ type: 'error', message: 'Please enter a valid email address.' });
      setIsSubmitting(false);
      return;
    }

    if (formData.linkedin_profile && !isValidUrl(formData.linkedin_profile)) {
      setSubmitStatus({ type: 'error', message: 'Please enter a valid LinkedIn URL.' });
      setIsSubmitting(false);
      return;
    }

    if (formData.portfolio_url && !isValidUrl(formData.portfolio_url)) {
      setSubmitStatus({ type: 'error', message: 'Please enter a valid Portfolio URL.' });
      setIsSubmitting(false);
      return;
    }

    if (formData.cv && formData.cv.size > 10 * 1024 * 1024) {
      setSubmitStatus({ type: 'error', message: 'CV file size must be less than 10MB.' });
      setIsSubmitting(false);
      return;
    }

    const payload = new FormData();
    payload.append('job',          formData.job);
    payload.append('full_name',    formData.full_name);
    payload.append('email',        formData.email);
    payload.append('phone',        formData.phone);
    payload.append('cover_letter', formData.cover_letter);
    payload.append('cv',           formData.cv);
    if (formData.linkedin_profile) payload.append('linkedin_profile', formData.linkedin_profile);
    if (formData.portfolio_url)    payload.append('portfolio_url',    formData.portfolio_url);

    try {
      const response = await fetch(API_APPLY, { method: 'POST', body: payload });

      if (response.ok) {
        // Success: Show modal instead of auto‑closing form
        setSubmitStatus({
          type: 'success',
          message: 'Your application has been submitted successfully!'
        });
        setShowSuccessModal(true); // NEW

        // Reset form fields (keep CV input reset)
        setFormData({
          full_name: '', email: '', phone: '', cover_letter: '',
          cv: null, linkedin_profile: '', portfolio_url: '', job: null
        });
        setSelectedJob(null);
        const cvInput = document.getElementById('cv-upload');
        if (cvInput) cvInput.value = '';

        // Do NOT close the form here — wait for modal "Okay"
      } else {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = 'There was an error submitting your application. Please try again.';

        if (response.status === 400) {
          const firstField = Object.keys(errorData)[0];
          if (firstField) {
            const msg = Array.isArray(errorData[firstField])
              ? errorData[firstField][0]
              : errorData[firstField];
            errorMessage = `${firstField.replace('_', ' ')}: ${msg}`;
          }
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        setSubmitStatus({ type: 'error', message: errorMessage });
      }
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler to close the modal and reset application state
  const handleModalOkay = () => {
    setShowSuccessModal(false);
    setSubmitStatus(null);
    setIsFormVisible(false); // close the form
  };

  const categories = ['all', 'full_time', 'part_time', 'contract', 'remote'];
  const filteredJobs = activeCategory === 'all'
    ? jobPostings
    : jobPostings.filter(job => job.job_type === activeCategory);

  const getGridTemplateColumns = () => {
    if (isMobile) return '1fr';
    const jobCount = filteredJobs.length;
    if (jobCount <= 1) return '1fr';
    if (jobCount === 2) return 'repeat(2, 1fr)';
    if (jobCount === 3) return 'repeat(3, 1fr)';
    return 'repeat(auto-fill, minmax(350px, 1fr))';
  };

  const getJobCardMaxWidth = () => {
    if (isMobile) return '100%';
    return filteredJobs.length === 1 ? '800px' : 'none';
  };

  const styles = {
    jobsSection: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '40px 20px' : '60px 40px',
      backgroundColor: LIGHT_GRAY,
    },
    sectionTitle: {
      textAlign: 'center',
      fontSize: isMobile ? '2.2rem' : '3rem',
      fontWeight: '800',
      color: DARK_GREEN,
      marginBottom: '20px',
      fontFamily: "'Poppins', sans-serif",
    },
    sectionSubtitle: {
      textAlign: 'center',
      fontSize: isMobile ? '1.1rem' : '1.3rem',
      color: BRIGHT_GREEN,
      marginBottom: '40px',
      maxWidth: '700px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: '1.6',
    },
    categoryFilter: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '15px',
      marginBottom: '50px',
    },
    categoryButton: (isActive) => ({
      padding: '12px 25px',
      borderRadius: '30px',
      border: `2px solid ${isActive ? BRIGHT_GREEN : DARK_GREEN}`,
      background: isActive ? BRIGHT_GREEN : 'transparent',
      color: isActive ? WHITE : DARK_GREEN,
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      outline: 'none',
      textTransform: 'capitalize',
      fontFamily: "'Poppins', sans-serif",
      letterSpacing: '0.5px',
    }),
    jobsGrid: {
      display: 'grid',
      gridTemplateColumns: getGridTemplateColumns(),
      gap: '30px',
      marginBottom: '80px',
      justifyContent: filteredJobs.length === 1 && !isMobile ? 'center' : 'stretch',
      alignItems: 'stretch',
    },
    jobCard: (isSelected) => ({
      background: WHITE,
      borderRadius: '15px',
      padding: '30px',
      boxShadow: isSelected ? `0 10px 30px ${DARK_GREEN}33` : '0 5px 20px rgba(0,0,0,0.08)',
      border: `2px solid ${isSelected ? BRIGHT_GREEN : 'transparent'}`,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      maxWidth: getJobCardMaxWidth(),
      margin: filteredJobs.length === 1 && !isMobile ? '0 auto' : '0',
      display: 'flex',
      flexDirection: 'column',
      height: filteredJobs.length === 1 && !isMobile ? 'auto' : '100%',
      minHeight: filteredJobs.length === 1 && !isMobile ? '400px' : '350px',
    }),
    jobTypeBadge: (type) => {
      const colors = { full_time: BRIGHT_GREEN, part_time: GOLD, contract: DARK_GREEN, remote: BRIGHT_GREEN };
      return {
        display: 'inline-block',
        background: colors[type] || DARK_GREEN,
        color: type === 'contract' ? WHITE : DARK_GREEN,
        padding: '6px 15px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
        marginBottom: '20px',
        alignSelf: 'flex-start',
      };
    },
    jobTitle: {
      fontSize: isMobile || filteredJobs.length > 1 ? '1.5rem' : '2rem',
      fontWeight: '700',
      color: DARK_GREEN,
      marginBottom: '15px',
      fontFamily: "'Poppins', sans-serif",
      lineHeight: '1.3',
    },
    jobLocation: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: BRIGHT_GREEN,
      fontSize: isMobile || filteredJobs.length > 1 ? '1rem' : '1.1rem',
      marginBottom: '20px',
      fontWeight: '500',
    },
    jobDescription: {
      color: '#4B5563',
      fontSize: isMobile || filteredJobs.length > 1 ? '1rem' : '1.1rem',
      lineHeight: '1.7',
      marginBottom: '25px',
      flex: 1,
    },
    jobMeta: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
      marginBottom: '25px',
      paddingTop: '15px',
      borderTop: '1px solid #E5E7EB',
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      color: '#6B7280',
      fontSize: '0.85rem',
    },
    applyButton: {
      width: '100%',
      padding: filteredJobs.length === 1 && !isMobile ? '18px' : '15px',
      background: DARK_GREEN,
      color: WHITE,
      border: 'none',
      borderRadius: '10px',
      fontSize: filteredJobs.length === 1 && !isMobile ? '1.1rem' : '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: "'Poppins', sans-serif",
      letterSpacing: '0.5px',
      marginTop: 'auto',
    },
    noJobsMessage: {
      textAlign: 'center',
      fontSize: '1.2rem',
      color: BRIGHT_GREEN,
      padding: '60px 20px',
      background: WHITE,
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
    },
    applicationSection:     { marginTop: '50px' },
    applicationFormSection: {
      background: WHITE,
      borderRadius: '15px',
      padding: isMobile ? '30px 20px' : '40px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      position: 'relative',
      maxWidth: '800px',
      margin: '0 auto',
    },
    formHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '15px',
    },
    formTitle: {
      fontSize: isMobile ? '1.8rem' : '2rem',
      fontWeight: '700',
      color: DARK_GREEN,
      fontFamily: "'Poppins', sans-serif",
      margin: 0,
    },
    closeButton: {
      padding: '10px 20px',
      background: 'transparent',
      color: BRIGHT_GREEN,
      border: `2px solid ${BRIGHT_GREEN}`,
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: "'Poppins', sans-serif",
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    selectedJobTitle: {
      textAlign: 'center',
      fontSize: isMobile ? '1.1rem' : '1.2rem',
      color: BRIGHT_GREEN,
      marginBottom: '30px',
      fontWeight: '500',
    },
    form:     { maxWidth: '800px', margin: '0 auto' },
    formRow:  { display: isMobile ? 'block' : 'flex', gap: '30px', marginBottom: '25px' },
    formGroup:{ flex: 1, marginBottom: isMobile ? '25px' : '0' },
    label:    { display: 'block', marginBottom: '10px', fontWeight: '600', color: DARK_GREEN, fontSize: '1rem' },
    required: { color: '#EF4444' },
    input: {
      width: '100%', padding: '15px', border: '2px solid #E5E7EB',
      borderRadius: '10px', fontSize: '1rem', transition: 'all 0.3s ease',
      fontFamily: "'Poppins', sans-serif", outline: 'none',
    },
    fileInput: {
      width: '100%', padding: '15px', border: `2px dashed ${BRIGHT_GREEN}`,
      borderRadius: '10px', fontSize: '1rem', background: LIGHT_GRAY, cursor: 'pointer',
    },
    fileInfo:  { fontSize: '0.85rem', color: '#6B7280', marginTop: '5px', marginLeft: '5px' },
    textarea: {
      width: '100%', padding: '15px', border: '2px solid #E5E7EB',
      borderRadius: '10px', fontSize: '1rem', minHeight: '150px', resize: 'vertical',
      fontFamily: "'Poppins', sans-serif", outline: 'none', transition: 'all 0.3s ease',
    },
    submitButton: {
      width: '100%', padding: '18px', background: DARK_GREEN, color: WHITE,
      border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: '600',
      cursor: 'pointer', transition: 'all 0.3s ease', marginTop: '20px',
      fontFamily: "'Poppins', sans-serif", letterSpacing: '1px',
    },
    statusMessage: {
      textAlign: 'center', marginTop: '20px', padding: '15px',
      borderRadius: '10px', fontWeight: '500', fontSize: '1rem',
    },
    showFormButton: {
      display: 'block', margin: '40px auto', padding: '15px 40px',
      background: BRIGHT_GREEN, color: WHITE, border: 'none', borderRadius: '10px',
      fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease',
      fontFamily: "'Poppins', sans-serif", boxShadow: `0 5px 20px ${BRIGHT_GREEN}4D`,
    },
    // Modal styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      background: WHITE,
      borderRadius: '20px',
      padding: isMobile ? '30px 20px' : '40px',
      maxWidth: '500px',
      width: '90%',
      textAlign: 'center',
      boxShadow: `0 20px 40px ${DARK_GREEN}33`,
    },
    modalIcon: {
      fontSize: '4rem',
      marginBottom: '20px',
      color: BRIGHT_GREEN,
    },
    modalTitle: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: DARK_GREEN,
      marginBottom: '15px',
    },
    modalMessage: {
      fontSize: '1.1rem',
      color: '#4B5563',
      marginBottom: '30px',
      lineHeight: '1.5',
    },
    modalButton: {
      background: BRIGHT_GREEN,
      color: WHITE,
      border: 'none',
      padding: '12px 30px',
      borderRadius: '50px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: "'Poppins', sans-serif",
    },
  };

  return (
    <section style={styles.jobsSection} id="open-positions">
      <motion.h2 style={styles.sectionTitle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        Open Positions
      </motion.h2>

      <motion.p style={styles.sectionSubtitle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
        Join our innovative team and build the future with us
      </motion.p>

      <motion.div style={styles.categoryFilter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
        {categories.map(category => (
          <button
            key={category}
            style={styles.categoryButton(activeCategory === category)}
            onClick={() => setActiveCategory(category)}
            onMouseEnter={(e) => {
              if (activeCategory !== category) {
                e.currentTarget.style.background = BRIGHT_GREEN;
                e.currentTarget.style.color = WHITE;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== category) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = DARK_GREEN;
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {category.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </motion.div>

      {filteredJobs.length > 0 ? (
        <motion.div style={styles.jobsGrid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
          {filteredJobs.map(job => (
            <motion.div
              key={job.id}
              style={styles.jobCard(selectedJob?.id === job.id)}
              onClick={() => handleJobSelect(job)}
              whileHover={{ y: -5, boxShadow: `0 15px 40px ${DARK_GREEN}40` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div style={styles.jobTypeBadge(job.job_type)}>
                {job.job_type.replace('_', ' ')}
              </div>

              <h3 style={styles.jobTitle}>{job.title}</h3>

              <div style={styles.jobLocation}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill={BRIGHT_GREEN} />
                </svg>
                {job.location}
              </div>

              <p style={styles.jobDescription}>
                {job.description.length > (filteredJobs.length === 1 && !isMobile ? 400 : 200)
                  ? `${job.description.substring(0, filteredJobs.length === 1 && !isMobile ? 400 : 200)}...`
                  : job.description}
              </p>

              <div style={styles.jobMeta}>
                <div style={styles.metaItem}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#6B7280" strokeWidth="1.5" />
                  </svg>
                  Posted: {new Date(job.posted_date).toLocaleDateString()}
                </div>
                {job.application_deadline && (
                  <div style={styles.metaItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#6B7280" strokeWidth="1.5" />
                      <path d="M16 2v4M8 2v4M3 10h18" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                  </div>
                )}
                {job.salary_range && (
                  <div style={styles.metaItem}>💰 {job.salary_range}</div>
                )}
              </div>

              <button
                style={styles.applyButton}
                onClick={(e) => { e.stopPropagation(); handleJobSelect(job); }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 25px ${DARK_GREEN}66`;
                  e.currentTarget.style.background = BRIGHT_GREEN;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = DARK_GREEN;
                }}
              >
                {selectedJob?.id === job.id ? "Selected • Click to Apply" : "Apply Now"}
              </button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div style={styles.noJobsMessage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          {activeCategory === 'all'
            ? "No open positions at the moment. Please check back later!"
            : `No ${activeCategory.replace('_', ' ')} positions available. Try another category.`}
        </motion.div>
      )}

      <div style={styles.applicationSection} ref={applicationSectionRef}>
        <AnimatePresence>
          {isFormVisible ? (
            <motion.div
              style={styles.applicationFormSection}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <div style={styles.formHeader}>
                <h3 style={styles.formTitle}>
                  {selectedJob ? `Apply for ${selectedJob.title}` : "Application Form"}
                </h3>
                <button
                  onClick={handleCloseForm}
                  style={styles.closeButton}
                  onMouseEnter={(e) => { e.currentTarget.style.background = BRIGHT_GREEN; e.currentTarget.style.color = WHITE; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = BRIGHT_GREEN; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Close Form
                </button>
              </div>

              {selectedJob && (
                <div style={styles.selectedJobTitle}>
                  {selectedJob.title} • {selectedJob.location} • {selectedJob.job_type.replace('_', ' ')}
                </div>
              )}

              {!selectedJob ? (
                <p style={{ textAlign: "center", color: BRIGHT_GREEN, marginBottom: "30px" }}>
                  Please select a job position from the list above to apply.
                </p>
              ) : (
                <form onSubmit={handleSubmit} style={styles.form}>
                  <div style={styles.formRow}>
                    <motion.div style={styles.formGroup} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                      <label style={styles.label}>Full Name <span style={styles.required}>*</span></label>
                      <motion.input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} style={styles.input} required whileFocus={{ scale: 1.02 }} />
                    </motion.div>
                    <motion.div style={styles.formGroup} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                      <label style={styles.label}>Email <span style={styles.required}>*</span></label>
                      <motion.input type="email" name="email" value={formData.email} onChange={handleInputChange} style={styles.input} required whileFocus={{ scale: 1.02 }} />
                    </motion.div>
                  </div>

                  <div style={styles.formRow}>
                    <motion.div style={styles.formGroup} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                      <label style={styles.label}>Phone Number <span style={styles.required}>*</span></label>
                      <motion.input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={styles.input} required whileFocus={{ scale: 1.02 }} />
                    </motion.div>
                    <motion.div style={styles.formGroup} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                      <label style={styles.label}>CV Upload <span style={styles.required}>*</span></label>
                      <motion.input id="cv-upload" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={styles.fileInput} required whileHover={{ scale: 1.02 }} />
                      <p style={styles.fileInfo}>Accepted formats: PDF, DOC, DOCX (Max: 10MB)</p>
                    </motion.div>
                  </div>

                  <motion.div style={styles.formGroup} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
                    <label style={styles.label}>Cover Letter <span style={styles.required}>*</span></label>
                    <motion.textarea name="cover_letter" value={formData.cover_letter} onChange={handleInputChange} style={styles.textarea} required whileFocus={{ scale: 1.01 }} placeholder="Tell us why you're the perfect fit for this position..." />
                  </motion.div>

                  <div style={styles.formRow}>
                    <motion.div style={styles.formGroup} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
                      <label style={styles.label}>LinkedIn Profile <span style={{ color: '#6B7280', fontWeight: 400 }}>(optional)</span></label>
                      <motion.input type="url" name="linkedin_profile" value={formData.linkedin_profile} onChange={handleInputChange} style={styles.input} whileFocus={{ scale: 1.02 }} placeholder="https://linkedin.com/in/yourprofile" />
                    </motion.div>
                    <motion.div style={styles.formGroup} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
                      <label style={styles.label}>Portfolio URL <span style={{ color: '#6B7280', fontWeight: 400 }}>(optional)</span></label>
                      <motion.input type="url" name="portfolio_url" value={formData.portfolio_url} onChange={handleInputChange} style={styles.input} whileFocus={{ scale: 1.02 }} placeholder="https://yourportfolio.com" />
                    </motion.div>
                  </div>

                  <motion.button
                    type="submit"
                    style={styles.submitButton}
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.05, y: -2, background: BRIGHT_GREEN } : {}}
                    whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </motion.button>

                  {submitStatus && submitStatus.type === 'error' && (
                    <motion.div
                      style={{
                        ...styles.statusMessage,
                        background: '#FEE2E2',
                        color: '#991B1B',
                        border: '1px solid #FECACA',
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {submitStatus.message}
                    </motion.div>
                  )}
                </form>
              )}
            </motion.div>
          ) : (
            selectedJob && (
              <motion.button
                style={styles.showFormButton}
                onClick={() => setIsFormVisible(true)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 25px ${BRIGHT_GREEN}80`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 5px 20px ${BRIGHT_GREEN}4D`;
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Show Application Form for {selectedJob.title}
              </motion.button>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            style={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleModalOkay} // clicking outside also closes
          >
            <motion.div
              style={styles.modalContent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              <div style={styles.modalIcon}>📄</div>
              <h3 style={styles.modalTitle}>CV Received!</h3>
              <p style={styles.modalMessage}>
                Your application has been successfully submitted. We'll review it and get back to you soon.
              </p>
              <button style={styles.modalButton} onClick={handleModalOkay}>
                Okay
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AvailableVacancies;