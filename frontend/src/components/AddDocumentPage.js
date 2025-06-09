import React, { useState } from 'react';
import { supabase } from '../../src/supabaseClient';
import { auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // ✅ You had this
import 'react-toastify/dist/ReactToastify.css';

function AddDocumentPage() {
  const [file, setFile] = useState(null);
  const [caseNumber, setCaseNumber] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate(); // ✅ You forgot this line

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      toast.error('You must be logged in to upload documents.');
      return;
    }

    if (!file || !caseNumber) {
      toast.error('Please provide both a file and a case number.');
      return;
    }

    try {
      setUploading(true);

      const filePath = `documents/${user.uid}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('case-documents')
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from('case-documents')
        .getPublicUrl(filePath);

      if (publicUrlError) throw publicUrlError;

      await addDoc(collection(db, 'caseDocuments'), {
        userId: user.uid,
        caseNumber,
        fileName: file.name,
        fileUrl: publicUrlData.publicUrl,
        uploadedAt: new Date(),
      });

      toast.success('Document uploaded successfully!');
      setFile(null);
      setCaseNumber('');
    } catch (error) {
      console.error('Upload error:', error.message);
      toast.error('Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container max-w-xl mx-auto p-4">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Upload Case Document</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Case Number:</label>
          <input
            type="text"
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Select Document:</label>
          <input
            type="file"
            onChange={handleFileChange}
            required
            className="w-full"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/document-list')} // ✅ This now works
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            View Uploaded Documents
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDocumentPage;
