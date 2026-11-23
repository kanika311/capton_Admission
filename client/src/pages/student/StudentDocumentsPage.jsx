import React, { useState, useEffect } from 'react';
import { Upload, FileCheck, Trash2, Shield, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StudentDocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('Class 10 Marksheet');
  const [file, setFile] = useState(null);

  const docTypes = [
    'Class 10 Marksheet',
    'Class 12 Marksheet',
    'Graduation Marksheet',
    'Identity Proof',
    'Photograph',
    'Other Documents',
  ];

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/students/profile');
      setDocuments(res.data.data?.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please choose a file to upload');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('docType', selectedDocType);

      const res = await api.post('/students/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setDocuments(res.data.data || []);
      setFile(null);
      toast.success('Document uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await api.delete(`/students/documents/${docId}`);
      setDocuments(res.data.data || []);
      toast.success('Document deleted');
    } catch (err) {
      toast.error('Failed to delete document');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div>
        <h2 className="text-xl font-extrabold text-brand-navy">Uploaded Documents Vault</h2>
        <p className="text-xs text-slate-500 mt-1">
          Upload verified marksheets and identity proofs for automated application forwarding.
        </p>
      </div>

      {/* Upload Box */}
      <form onSubmit={handleUpload} className="bg-white p-6 rounded-2xl border border-brand-border shadow-card space-y-4">
        <h3 className="font-bold text-sm text-brand-navy">Upload New Document</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Document Category</label>
            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none"
            >
              {docTypes.map((dt) => (
                <option key={dt} value={dt}>{dt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select File (PDF, JPG, PNG)</label>
            <input
              type="file"
              required
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-brand-royal hover:file:bg-blue-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="px-5 py-2.5 bg-brand-royal hover:bg-brand-navy text-white font-bold rounded-xl text-xs shadow flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload Document'}</span>
        </button>
      </form>

      {/* Uploaded Documents List */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-card p-6 space-y-4">
        <h3 className="font-bold text-base text-brand-navy border-b border-slate-100 pb-3">
          My Saved Documents ({documents.length})
        </h3>

        {loading ? (
          <p className="text-xs text-slate-400 py-6 text-center">Loading vault...</p>
        ) : documents.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">
            No documents uploaded yet. Add your 10th and 12th marksheets above.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <div key={doc._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-brand-royal flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-navy">{doc.docType}</h5>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs">{doc.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      doc.status === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {doc.status}
                  </span>

                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDocumentsPage;
