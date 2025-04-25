import React, {useEffect} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PdfViewer = ({setProgress}) => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('view');
  const iframeUrl = `https://drive.google.com/file/d/${url}/preview`

  const navigate = useNavigate();
  const onClose = () => {
    navigate(-1);
  }

  //----[useEffect]---------
  useEffect(() => {
    setProgress(0);
    setProgress(100);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div
        className="w-100 bg-white"
        style={{ height: 'calc(100vh - 64px)', backgroundColor: 'black', zIndex: 1050, margin: 0 }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn btn-dark position-fixed"
          style={{ top: 70, right: 10, zIndex: 1100 }}
        >
          Close
        </button>

        {/* Iframe Container */}
        <iframe
          src={iframeUrl}
          className="w-100 h-100 border-0"
          title="PDF Viewer"
        ></iframe>
      </div>
      <div style={{ backgroundColor: '#1E1E1E', minHeight: "10px" }}>
      </div>
    </>
  );
};

export default PdfViewer;
