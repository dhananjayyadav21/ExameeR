// components/PDFViewer.js
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from "@/components/ui/button"; // If using shadcn, else use regular button

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop(); // Optional: you can name the file
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto my-4 shadow-md p-4 rounded-xl border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">PDF Viewer</h2>
        <Button onClick={handleDownload}>Download PDF</Button>
      </div>

      <div className="overflow-auto border rounded-md max-h-[600px]">
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<p className="p-4">Loading PDF...</p>}
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={800}
              className="mx-auto mb-4"
            />
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
