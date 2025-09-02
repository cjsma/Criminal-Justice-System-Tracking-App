import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import BackButton from '../components/BackButton';


function DocumentListViewer() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { data, error } = await supabase.storage
          .from('Case-documents')
          .list('', {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' },
          });

        if (error) throw error;
        setDocuments(data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch documents.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const getDownloadUrl = async (fileName) => {
    const { data, error } = await supabase.storage
      .from('Case-documents')
      .createSignedUrl(fileName, 300);
    if (error) {
      console.error(error);
      return null;
    }
    return data.signedUrl;
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Uploaded Documents</h2>
      {loading && <p>Loading documents...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && documents.length === 0 && <p>No documents uploaded yet.</p>}
      <ul className="space-y-3">
        {documents.map((doc, index) => (
          <li
            key={index}
            className="p-3 border rounded shadow flex justify-between items-center"
          >
            <span>{doc.name}</span>
            <button
              onClick={async () => {
                const url = await getDownloadUrl(doc.name);
                if (url) window.open(url, '_blank');
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              View / Download
            </button>
          </li>
        ))}
      </ul>
      <BackButton/>
    </div>
  );
}

export default DocumentListViewer;
