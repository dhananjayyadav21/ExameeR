"use client";
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import ContentContext from '@/context/ContentContext';
import DriveUpload from '@/utils/DriveUpload';

const CATEGORIES = ['Engineering', 'Medical', 'Management', 'Law', 'Commerce', 'Science', 'Arts', 'Other'];
const FILE_TYPES = ['pdf', 'epub', 'link'];

const emptyForm = {
    title: '', author: '', description: '', category: 'Engineering',
    subject: '', coverImage: '', fileUrl: '', fileType: 'pdf', isPremium: false, tags: '',
};

function getToken() {
    try { return localStorage.getItem('token') || ''; } catch { return ''; }
}

function authHeader() {
    return { 'Content-Type': 'application/json', AuthToken: getToken() };
}

export default function DashboardBooks() {
    const { userData } = useContext(ContentContext);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('All');

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    // Upload states
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfUploading, setPdfUploading] = useState(false);
    const [coverFile, setCoverFile] = useState(null);
    const [coverUploading, setCoverUploading] = useState(false);

    // Access panel
    const [showAccess, setShowAccess] = useState(false);
    const [accessBook, setAccessBook] = useState(null);
    const [accessors, setAccessors] = useState([]);
    const [accessLoading, setAccessLoading] = useState(false);

    useEffect(() => { fetchBooks(); }, []);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/books?all=1', { headers: authHeader() });
            const data = await res.json();
            if (data.success) setBooks(data.books);
        } catch { toast.error('Failed to fetch books'); }
        setLoading(false);
    };

    const openCreate = () => { setEditingId(null); setForm(emptyForm); setPdfFile(null); setCoverFile(null); setShowModal(true); };
    const openEdit = (book) => {
        setEditingId(book._id);
        setForm({
            title: book.title, author: book.author, description: book.description || '',
            category: book.category, subject: book.subject || '',
            coverImage: book.coverImage || '', fileUrl: book.fileUrl || '',
            fileType: book.fileType || 'pdf', isPremium: book.isPremium || false,
            tags: (book.tags || []).join(', '),
        });
        setPdfFile(null); setCoverFile(null);
        setShowModal(true);
    };

    // ── PDF → Google Drive ──
    const handlePdfChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') { toast.warning('Only PDF files are allowed'); return; }
        setPdfFile(file);
        setPdfUploading(true);
        try {
            const result = await DriveUpload(file);
            if (result?.success && result?.fileId) {
                setForm(f => ({ ...f, fileUrl: result.fileId, fileType: 'pdf' }));
                toast.success('PDF uploaded to Drive!');
            } else { toast.warning('Drive upload failed — check file or try again'); }
        } catch (err) { toast.error(err.message); }
        setPdfUploading(false);
    };

    // ── Cover Image → Vercel Blob ──
    const handleCoverChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.warning('Only image files are allowed'); return; }
        setCoverFile(file);
        setCoverUploading(true);
        try {
            const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                method: 'POST',
                body: file,
            });
            const blob = await res.json();
            if (blob?.url) {
                setForm(f => ({ ...f, coverImage: blob.url }));
                toast.success('Cover image uploaded!');
            } else { toast.warning('Image upload failed'); }
        } catch (err) { toast.error(err.message); }
        setCoverUploading(false);
    };

    const handleSave = async () => {
        if (!form.title.trim() || !form.author.trim()) { toast.error('Title and author are required'); return; }
        setSaving(true);
        try {
            const body = {
                ...form,
                tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                ...(editingId ? { id: editingId } : {}),
            };
            const res = await fetch('/api/books', {
                method: editingId ? 'PUT' : 'POST',
                headers: authHeader(),
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(editingId ? 'Book updated!' : 'Book added!');
                setShowModal(false);
                fetchBooks();
            } else { toast.error(data.message || 'Failed to save'); }
        } catch { toast.error('Network error'); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this book? This cannot be undone.')) return;
        try {
            const res = await fetch(`/api/books?id=${id}`, { method: 'DELETE', headers: authHeader() });
            const data = await res.json();
            if (data.success) { toast.success('Book deleted'); fetchBooks(); }
            else toast.error(data.message);
        } catch { toast.error('Network error'); }
    };

    const handleTogglePublish = async (book) => {
        try {
            const res = await fetch('/api/books', {
                method: 'PUT',
                headers: authHeader(),
                body: JSON.stringify({ id: book._id, isPublished: !book.isPublished }),
            });
            const data = await res.json();
            if (data.success) { fetchBooks(); toast.success(data.book.isPublished ? 'Book published' : 'Book unpublished'); }
        } catch { toast.error('Network error'); }
    };

    const handleViewAccess = async (book) => {
        setAccessBook(book);
        setAccessors([]);
        setAccessLoading(true);
        setShowAccess(true);
        try {
            const res = await fetch(`/api/books/access?bookId=${book._id}`, { headers: authHeader() });
            const data = await res.json();
            if (data.success) setAccessors(data.accessors);
            else toast.error(data.message);
        } catch { toast.error('Network error'); }
        setAccessLoading(false);
    };

    const filtered = books.filter(b =>
        (filterCat === 'All' || b.category === filterCat) &&
        (b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.author.toLowerCase().includes(search.toLowerCase()))
    );

    const totalAccess = books.reduce((s, b) => s + (b.accessCount || 0), 0);

    return (
        <div className="db-page">
            {/* ── Header ── */}
            <div className="db-header">
                <div>
                    <h1 className="db-title">Examee <span className="db-accent">Books</span></h1>
                    <p className="db-subtitle">Add, manage and track digital library resources.</p>
                </div>
                <button className="db-create-btn" onClick={openCreate}>
                    <i className="fa-solid fa-plus"></i> Add Book
                </button>
            </div>

            {/* ── Stats ── */}
            <div className="db-stats-row">
                <div className="db-stat"><i className="fa-solid fa-book-open" style={{ color: '#3b82f6' }}></i><div><div className="db-stat-val">{books.length}</div><div className="db-stat-lbl">Total Books</div></div></div>
                <div className="db-stat"><i className="fa-solid fa-eye" style={{ color: '#04bd20' }}></i><div><div className="db-stat-val">{totalAccess}</div><div className="db-stat-lbl">Total Opens</div></div></div>
                <div className="db-stat"><i className="fa-solid fa-crown" style={{ color: '#f59e0b' }}></i><div><div className="db-stat-val">{books.filter(b => b.isPremium).length}</div><div className="db-stat-lbl">Premium Books</div></div></div>
                <div className="db-stat"><i className="fa-solid fa-circle-check" style={{ color: '#8b5cf6' }}></i><div><div className="db-stat-val">{books.filter(b => b.isPublished).length}</div><div className="db-stat-lbl">Published</div></div></div>
            </div>

            {/* ── Table Card ── */}
            <div className="db-card">
                {/* Toolbar */}
                <div className="db-toolbar">
                    <div className="db-search">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input placeholder="Search books..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="db-cat-tabs">
                        {['All', ...CATEGORIES].map(cat => (
                            <button key={cat} className={`db-cat-tab${filterCat === cat ? ' active' : ''}`} onClick={() => setFilterCat(cat)}>{cat}</button>
                        ))}
                    </div>
                    <span className="db-count">{filtered.length} book{filtered.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Table */}
                <div className="table-responsive">
                    <table className="db-table">
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>Category</th>
                                <th className="text-center">Type</th>
                                <th className="text-center">Opens</th>
                                <th className="text-center">Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [1, 2, 3, 4].map(i => (
                                    <tr key={i}>
                                        <td><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div className="db-skel" style={{ width: '44px', height: '60px', borderRadius: '6px' }}></div><div><div className="db-skel" style={{ width: '160px', height: '13px' }}></div><div className="db-skel" style={{ width: '100px', height: '11px', marginTop: '6px' }}></div></div></div></td>
                                        <td><div className="db-skel" style={{ width: '80px', height: '22px', borderRadius: '8px' }}></div></td>
                                        <td className="text-center"><div className="db-skel mx-auto" style={{ width: '50px', height: '22px', borderRadius: '8px' }}></div></td>
                                        <td className="text-center"><div className="db-skel mx-auto" style={{ width: '40px', height: '22px', borderRadius: '8px' }}></div></td>
                                        <td className="text-center"><div className="db-skel mx-auto" style={{ width: '70px', height: '22px', borderRadius: '20px' }}></div></td>
                                        <td className="text-end"><div className="db-skel ms-auto" style={{ width: '90px', height: '32px', borderRadius: '8px' }}></div></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center" style={{ padding: '60px 0' }}>
                                        <div className="db-empty-icon"><i className="fa-solid fa-book-open"></i></div>
                                        <div className="db-empty-title">No books found</div>
                                        <div className="db-empty-sub">Add your first digital resource.</div>

                                    </td>
                                </tr>
                            ) : (
                                filtered.map(book => (
                                    <tr key={book._id} className="db-row">
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {book.coverImage ? (
                                                    <img src={book.coverImage} alt="" className="db-book-thumb" />
                                                ) : (
                                                    <div className="db-book-thumb-placeholder">
                                                        <i className="fa-solid fa-book"></i>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="db-book-title">{book.title}</div>
                                                    <div className="db-book-author">by {book.author}</div>
                                                    {book.isPremium && <span className="db-premium-badge"><i className="fa-solid fa-crown me-1"></i>Premium</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="db-cat-badge">{book.category}</span></td>
                                        <td className="text-center"><span className="db-type-badge">{(book.fileType || 'pdf').toUpperCase()}</span></td>
                                        <td className="text-center">
                                            <button
                                                onClick={() => handleViewAccess(book)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', margin: '0 auto', color: '#15803d', fontWeight: 700, fontSize: '0.8rem' }}
                                            >
                                                <i className="fa-solid fa-eye" style={{ fontSize: '0.7rem' }}></i>{book.accessCount || 0}
                                            </button>
                                        </td>
                                        <td className="text-center">
                                            <button
                                                onClick={() => handleTogglePublish(book)}
                                                style={{ background: book.isPublished ? '#f0fdf4' : '#f8fafc', color: book.isPublished ? '#15803d' : '#94a3b8', border: `1px solid ${book.isPublished ? '#bbf7d0' : '#e2e8f0'}`, padding: '3px 10px', borderRadius: '20px', fontSize: '0.62rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                            >
                                                {book.isPublished ? '● Published' : '○ Hidden'}
                                            </button>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    onClick={() => handleViewAccess(book)}
                                                    title="Who accessed"
                                                    style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid transparent', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', cursor: 'pointer', color: '#15803d' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#bbf7d0'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                                >
                                                    <i className="fa-solid fa-users"></i>
                                                </button>
                                                <button
                                                    onClick={() => openEdit(book)}
                                                    title="Edit"
                                                    style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid transparent', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', cursor: 'pointer', color: '#3b82f6' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                                >
                                                    <i className="fa-solid fa-pencil"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(book._id)}
                                                    title="Delete"
                                                    style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid transparent', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', cursor: 'pointer', color: '#ef4444' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ─────────────── ADD / EDIT MODAL ─────────────── */}
            {showModal && (
                <div className="db-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="db-modal" onClick={e => e.stopPropagation()}>
                        <div className="db-modal-header">
                            <div>
                                <div className="db-modal-title">{editingId ? 'Edit Book' : 'Add New Book'}</div>
                                <div className="db-modal-sub">Fill in the details below</div>
                            </div>
                            <button className="db-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="db-modal-body">
                            <div className="db-form-row">
                                <div className="db-form-group">
                                    <label>Title <span className="db-req">*</span></label>
                                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Book title" />
                                </div>
                                <div className="db-form-group">
                                    <label>Author <span className="db-req">*</span></label>
                                    <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} placeholder="Author name" />
                                </div>
                            </div>
                            <div className="db-form-group">
                                <label>Description</label>
                                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description..." rows={3} />
                            </div>
                            <div className="db-form-row">
                                <div className="db-form-group">
                                    <label>Category <span className="db-req">*</span></label>
                                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="db-form-group">
                                    <label>Subject</label>
                                    <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Mathematics, Biology" />
                                </div>
                            </div>

                            {/* ── PDF Upload → Google Drive ── */}
                            <div className="db-form-group">
                                <label>
                                    <i className="fa-brands fa-google-drive me-1" style={{ color: '#fbbc04' }}></i>
                                    PDF File — Upload to Google Drive
                                </label>
                                <input type="file" id="bookPdfFile" accept="application/pdf" onChange={handlePdfChange} style={{ display: 'none' }} />
                                <label htmlFor="bookPdfFile" className={`db-dropzone ${pdfFile ? 'db-dropzone--ok' : ''}`}>
                                    {pdfUploading ? (
                                        <><div className="db-spin"></div><span>Uploading to Drive...</span></>
                                    ) : pdfFile ? (
                                        <><i className="fa-solid fa-file-circle-check" style={{ color: '#04bd20', fontSize: '1.4rem' }}></i>
                                            <span style={{ color: '#04bd20', fontWeight: 600 }}>{pdfFile.name}</span>
                                            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Click to replace</span></>
                                    ) : (
                                        <><i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '1.4rem', color: '#94a3b8' }}></i>
                                            <span>Drop PDF here or <span style={{ color: '#04bd20' }}>browse</span></span>
                                            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>PDF only · Max 10MB</span></>
                                    )}
                                </label>
                                {form.fileUrl && !pdfUploading && (
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                                        <i className="fa-solid fa-link me-1"></i>
                                        <span style={{ wordBreak: 'break-all' }}>Saved: {form.fileUrl.length > 60 ? form.fileUrl.slice(0, 60) + '…' : form.fileUrl}</span>
                                    </div>
                                )}
                            </div>

                            {/* ── Cover Image → Vercel Blob ── */}
                            <div className="db-form-group">
                                <label>
                                    <i className="fa-solid fa-image me-1" style={{ color: '#3b82f6' }}></i>
                                    Cover Image — Upload to Vercel Blob
                                </label>
                                <input type="file" id="bookCoverImg" accept="image/*" onChange={handleCoverChange} style={{ display: 'none' }} />
                                <label htmlFor="bookCoverImg" className={`db-dropzone db-dropzone--img ${coverFile ? 'db-dropzone--ok' : ''}`}>
                                    {coverUploading ? (
                                        <><div className="db-spin"></div><span>Uploading image...</span></>
                                    ) : form.coverImage ? (
                                        <><img src={form.coverImage} alt="cover" style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                                            <span style={{ fontWeight: 600, color: '#04bd20', fontSize: '0.78rem' }}>Cover uploaded ✓</span>
                                            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Click to replace</span></>
                                    ) : (
                                        <><i className="fa-solid fa-image" style={{ fontSize: '1.4rem', color: '#94a3b8' }}></i>
                                            <span>Upload cover image or <span style={{ color: '#04bd20' }}>browse</span></span>
                                            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>JPG / PNG / WebP</span></>
                                    )}
                                </label>
                                {/* Manual URL fallback */}
                                <input
                                    value={form.coverImage}
                                    onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
                                    placeholder="Or paste image URL directly..."
                                    style={{ marginTop: '6px', fontSize: '0.75rem' }}
                                />
                            </div>

                            <div className="db-form-group">
                                <label>Tags <span style={{ color: '#94a3b8', fontWeight: 400 }}>(comma-separated)</span></label>
                                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. exam, ncert, gate" />
                            </div>
                            <div className="db-form-group">
                                <label className="db-toggle">
                                    <input type="checkbox" checked={form.isPremium} onChange={e => setForm(f => ({ ...f, isPremium: e.target.checked }))} />
                                    <span className="db-toggle-track"></span>
                                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>
                                        Premium Only <span style={{ color: '#f59e0b' }}><i className="fa-solid fa-crown"></i></span>
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="db-modal-footer">
                            <button className="db-btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="db-btn-save" onClick={handleSave} disabled={saving || pdfUploading || coverUploading}>
                                {saving ? <><i className="fa-solid fa-spinner fa-spin me-2"></i>Saving...</> : <><i className="fa-solid fa-floppy-disk me-2"></i>{editingId ? 'Update Book' : 'Add Book'}</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─────────────── ACCESS TRACKER PANEL ─────────────── */}
            {showAccess && (
                <div className="acc-overlay" onClick={() => setShowAccess(false)}>
                    <div className="acc-panel" onClick={e => e.stopPropagation()}>
                        <div className="acc-header">
                            <div>
                                <div className="acc-header-title"><i className="fa-solid fa-users me-2" style={{ color: '#04bd20' }}></i>Who Accessed</div>
                                <div className="acc-header-sub">{accessBook?.title}</div>
                            </div>
                            <button onClick={() => setShowAccess(false)} style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', color: '#94a3b8', padding: '4px 8px' }}>✕</button>
                        </div>

                        <div className="acc-body">
                            {accessLoading ? (
                                [1, 2, 3, 4].map(i => (
                                    <div key={i} className="acc-card">
                                        <div className="db-skel" style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 }}></div>
                                        <div style={{ flex: 1 }}>
                                            <div className="db-skel" style={{ width: '140px', height: '13px' }}></div>
                                            <div className="db-skel" style={{ width: '100px', height: '11px', marginTop: '6px' }}></div>
                                        </div>
                                        <div className="db-skel" style={{ width: '40px', height: '30px', borderRadius: '8px' }}></div>
                                    </div>
                                ))
                            ) : accessors.length === 0 ? (
                                <div className="acc-empty">
                                    <i className="fa-solid fa-eye-slash" style={{ fontSize: '2rem', color: '#cbd5e1', marginBottom: '12px', display: 'block' }}></i>
                                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>No accesses yet</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Nobody has opened this book yet.</div>
                                </div>
                            ) : (
                                accessors.map((a, idx) => {
                                    const user = a.user || {};
                                    const name = [user.FirstName, user.LastName].filter(Boolean).join(' ') || user.Username || 'Unknown';
                                    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                                    const avatarUrl = user.Profile ? (user.Profile.startsWith('http') ? user.Profile : `https://lh3.googleusercontent.com/d/${user.Profile}`) : null;
                                    const planColors = { pro: '#f59e0b', plus: '#8b5cf6', e0: '#64748b' };
                                    const planColor = planColors[user.Plan] || '#64748b';

                                    return (
                                        <div key={idx} className="acc-card">
                                            <div className="acc-rank">#{idx + 1}</div>
                                            <div className="acc-avatar">
                                                {avatarUrl ? <img src={avatarUrl} alt={name} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} /> : null}
                                                <span>{initials}</span>
                                            </div>
                                            <div className="acc-info">
                                                <div className="acc-name">{name}</div>
                                                <div className="acc-meta">
                                                    <span>{user.Email || '—'}</span>
                                                    {user.Course && <><span className="acc-dot">·</span><span>{user.Course}</span></>}
                                                    <span className="acc-plan-badge" style={{ color: planColor, borderColor: planColor + '40', background: planColor + '12' }}>
                                                        {(user.Plan || 'e0').toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="acc-stats">
                                                <div className="acc-opens">{a.accessCount || 0}×</div>
                                                <div className="acc-date">{a.lastAccessedAt ? new Date(a.lastAccessedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .db-page { max-width: 1300px; margin: 0 auto; font-family: 'Inter', sans-serif; }

                /* Header */
                .db-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 20px; }
                .db-title { font-size: 1.3rem; font-weight: 800; color: #0f172a; margin: 0 0 3px; letter-spacing: -0.02em; }
                .db-accent { color: #04bd20; }
                .db-subtitle { font-size: 0.75rem; color: #94a3b8; margin: 0; font-weight: 500; }
                .db-create-btn { background: linear-gradient(135deg, #04bd20, #029d1a); color: #fff; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(4,189,32,0.25); }
                .db-create-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(4,189,32,0.35); }

                /* Stats */
                .db-stats-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
                .db-stat { background: #fff; border: 1px solid #f1f5f9; border-radius: 14px; padding: 14px 18px; display: flex; align-items: center; gap: 12px; flex: 1; min-width: 140px; }
                .db-stat i { font-size: 1.1rem; }
                .db-stat-val { font-size: 1.3rem; font-weight: 900; color: #0f172a; line-height: 1; }
                .db-stat-lbl { font-size: 0.65rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }

                /* Card + Toolbar */
                .db-card { background: #fff; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden; }
                .db-toolbar { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #f1f5f9; flex-wrap: wrap; }
                .db-search { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 10px; padding: 7px 12px; flex: 1; min-width: 180px; }
                .db-search i { color: #94a3b8; font-size: 0.75rem; }
                .db-search input { border: none; background: transparent; outline: none; font-size: 0.8rem; color: #0f172a; width: 100%; }
                .db-cat-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
                .db-cat-tab { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 4px 10px; font-size: 0.68rem; font-weight: 600; color: #64748b; cursor: pointer; white-space: nowrap; }
                .db-cat-tab.active { background: #0f172a; color: #fff; border-color: #0f172a; }
                .db-count { font-size: 0.72rem; color: #94a3b8; font-weight: 600; white-space: nowrap; margin-left: auto; }

                /* Table */
                .db-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
                .db-table th { padding: 10px 16px; font-size: 0.65rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #f1f5f9; white-space: nowrap; background: #fafafa; }
                .db-table td { padding: 12px 16px; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
                .db-row:last-child td { border-bottom: none; }
                .db-row:hover td { background: #fafafa; }
                .db-skel { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }
                @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

                /* Book cells */
                .db-book-thumb { width: 44px; height: 60px; object-fit: cover; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); flex-shrink: 0; }
                .db-book-thumb-placeholder { width: 44px; height: 60px; border-radius: 6px; background: linear-gradient(135deg, #e2e8f0, #cbd5e1); display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 1rem; flex-shrink: 0; }
                .db-book-title { font-size: 0.82rem; font-weight: 700; color: #0f172a; max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .db-book-author { font-size: 0.7rem; color: #64748b; margin-top: 2px; }
                .db-premium-badge { background: #fffbeb; color: #f59e0b; border: 1px solid #fef3c7; padding: 1px 7px; border-radius: 6px; font-size: 0.6rem; font-weight: 800; display: inline-flex; align-items: center; margin-top: 4px; }
                .db-cat-badge { background: #f0f4ff; color: #4f46e5; border: 1px solid #e0e7ff; padding: 3px 10px; border-radius: 8px; font-size: 0.65rem; font-weight: 700; white-space: nowrap; }
                .db-type-badge { background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; padding: 3px 10px; border-radius: 8px; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.04em; }

                /* Empty state */
                .db-empty-icon { width: 56px; height: 56px; background: #f8fafc; border-radius: 16px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #cbd5e1; }
                .db-empty-title { font-weight: 800; color: #0f172a; margin-bottom: 4px; }
                .db-empty-sub { font-size: 0.75rem; color: #94a3b8; }

                /* Modal */
                .db-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); z-index: 1050; display: flex; align-items: center; justify-content: center; padding: 20px; }
                .db-modal { background: #fff; border-radius: 20px; width: 100%; max-width: 580px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 24px 64px rgba(0,0,0,0.18); }
                .db-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid #f1f5f9; }
                .db-modal-title { font-size: 1rem; font-weight: 800; color: #0f172a; }
                .db-modal-sub { font-size: 0.72rem; color: #94a3b8; margin-top: 2px; }
                .db-modal-close { background: #f8fafc; border: none; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; color: #64748b; font-size: 0.85rem; }
                .db-modal-body { padding: 20px 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }
                .db-modal-footer { padding: 16px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; }
                .db-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
                .db-form-group { display: flex; flex-direction: column; gap: 5px; }
                .db-form-group label { font-size: 0.75rem; font-weight: 700; color: #374151; }
                .db-req { color: #ef4444; }
                .db-form-group input, .db-form-group select, .db-form-group textarea { border: 1px solid #e2e8f0; border-radius: 10px; padding: 9px 12px; font-size: 0.8rem; color: #0f172a; outline: none; background: #fafafa; transition: border-color 0.15s; resize: vertical; }
                .db-form-group input:focus, .db-form-group select:focus, .db-form-group textarea:focus { border-color: #04bd20; background: #fff; }
                .db-toggle { display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; }
                .db-toggle input[type="checkbox"] { display: none; }
                .db-toggle-track { width: 40px; height: 22px; border-radius: 20px; background: #e2e8f0; position: relative; flex-shrink: 0; transition: background 0.2s; }
                .db-toggle input:checked ~ .db-toggle-track { background: #04bd20; }
                .db-toggle-track::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: white; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
                .db-toggle input:checked ~ .db-toggle-track::after { transform: translateX(18px); }
                .db-btn-cancel { background: #f8fafc; border: 1px solid #e2e8f0; padding: 9px 20px; border-radius: 10px; font-size: 0.8rem; font-weight: 600; cursor: pointer; color: #64748b; }
                .db-btn-save { background: linear-gradient(135deg, #04bd20, #029d1a); color: #fff; border: none; padding: 9px 24px; border-radius: 10px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; }
                .db-btn-save:disabled { opacity: 0.7; cursor: not-allowed; }

                /* Dropzones */
                .db-dropzone { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; border: 2px dashed #e2e8f0; border-radius: 12px; padding: 20px 16px; background: #f8fafc; cursor: pointer; text-align: center; transition: all 0.2s; font-size: 0.8rem; color: #374151; }
                .db-dropzone:hover { border-color: #04bd20; background: rgba(4,189,32,0.03); }
                .db-dropzone--ok { border-color: #04bd20; background: rgba(4,189,32,0.04); }
                .db-dropzone--img { flex-direction: row; justify-content: flex-start; padding: 12px 16px; gap: 12px; }
                .db-spin { width: 22px; height: 22px; border: 2px solid rgba(4,189,32,0.2); border-top-color: #04bd20; border-radius: 50%; animation: spin 0.7s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* Access panel */

                .acc-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.35); z-index: 1050; display: flex; justify-content: flex-end; }
                .acc-panel { width: 380px; max-width: 100%; background: #fff; height: 100%; display: flex; flex-direction: column; box-shadow: -8px 0 40px rgba(0,0,0,0.12); animation: slideIn 0.25s ease; }
                @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
                .acc-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 20px 20px 14px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; }
                .acc-header-title { font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-bottom: 3px; }
                .acc-header-sub { font-size: 0.7rem; color: #94a3b8; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 280px; }
                .acc-body { flex: 1; overflow-y: auto; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
                .acc-card { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid #f1f5f9; border-radius: 12px; padding: 12px 14px; transition: box-shadow 0.15s; }
                .acc-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
                .acc-rank { font-size: 0.6rem; font-weight: 800; color: #cbd5e1; width: 18px; flex-shrink: 0; text-align: center; }
                .acc-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #04bd20, #16a34a); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; color: #fff; flex-shrink: 0; overflow: hidden; }
                .acc-avatar img { width: 100%; height: 100%; object-fit: cover; }
                .acc-info { flex: 1; min-width: 0; }
                .acc-name { font-size: 0.82rem; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
                .acc-meta { display: flex; align-items: center; gap: 5px; font-size: 0.62rem; color: #94a3b8; flex-wrap: wrap; }
                .acc-dot { color: #cbd5e1; }
                .acc-plan-badge { padding: 1px 6px; border-radius: 4px; font-size: 0.6rem; font-weight: 700; border: 1px solid; }
                .acc-stats { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; }
                .acc-opens { font-size: 0.95rem; font-weight: 900; color: #15803d; }
                .acc-date { font-size: 0.6rem; color: #94a3b8; font-weight: 600; white-space: nowrap; }
                .acc-empty { text-align: center; padding: 48px 20px; }

                @media (max-width: 640px) {
                    .db-form-row { grid-template-columns: 1fr; }
                    .acc-panel { width: 100%; }
                }
            `}</style>
        </div>
    );
}
