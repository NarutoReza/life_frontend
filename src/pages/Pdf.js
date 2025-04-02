import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PDFDocument } from 'pdf-lib';


function Pdf() {
  const [initialize, setInitialize] = useState(true);
  const [pdfUrl, setPdf] = useState(null);
  console.log("pdf...", pdfUrl);
  const [pageNumber, setPageNumber] = useState('');
  const [pdfBlob, setPdfBlob] = useState(null);

  const getPdf = async () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}api/some/get`, {responseType: 'blob'})
      .then((res) => {
        console.log(res)
        setTimeout(() => {
          setPdfBlob(res.data);
          const url = URL.createObjectURL(res.data);
          setPdf(url);
        }, 3000);
      })
      .catch((err) => {
        setPdf(null);
        console.log(err)
        toast.error(err.response.data.message || err.message);
      })
  };

  useEffect(() => {
    getPdf();
  }, []);

  const downloadPage = async (e) => {
    e.preventDefault();
    try {
      if (!pdfBlob) {
        throw new Error("PDF not available");
      }

      const existingPdfBytes = await pdfBlob.arrayBuffer();
      const originalPdfDoc = await PDFDocument.load(existingPdfBytes);
      const newPdfDoc = await PDFDocument.create();

      const pageIndex = parseInt(pageNumber, 10) - 1;
      if (pageIndex < 0 || pageIndex >= originalPdfDoc.getPageCount()) {
        toast.warning("Invalid page number");
        return;
      }

      const [copiedPage] = await newPdfDoc.copyPages(originalPdfDoc, [pageIndex]);
      if (!copiedPage) {
        throw new Error("Requested page does not exist");
      }

      newPdfDoc.addPage(copiedPage);

      const pdfBytes = await newPdfDoc.save();
      const newBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(newBlob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `pdf-page-${pageNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF page:", error);
      toast.error("Could not download the specified page.");
    }
  };

  return (
    <div>
      {
        initialize ? (
          <>
            <p>Please turn of your downloading extensions before Proceeding</p>
            <button type='button' onClick={() => {setInitialize(false)}}>Proceed</button>
          </>
        ) :
        pdfUrl ? (
          <>
            <form onSubmit={downloadPage}>
              <input type='number' placeholder='Page number' value={pageNumber} onChange={e => {
                if(e.target.value > 0) {
                  setPageNumber(e.target.value);
                } else {
                  setPageNumber('');
                }
              }} required />
              <button type='submit'>Download</button>
            </form>
            <object
              data={pdfUrl}
              type="application/pdf"
              width="100%"
              height="600px"
            >
              <p>
                Your browser does not support PDFs. Please{" "}
                <a href={pdfUrl}>download the PDF</a>.
              </p>
            </object>
          </>
        ) : (
          <div>Loading pdf...</div>
        )
      }
    </div>
  )
};

export default Pdf;