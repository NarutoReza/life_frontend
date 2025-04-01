import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Pdf() {
  const [pdf, setPdf] = useState(null);
  console.log("pdf...", pdf);

  const getPdf = async () => {
    axios
      .post(`http://localhost:8080/api/pdf/get-pdf`, {name: "pdf"}, {responseType: 'blob'})
      .then((res) => {
        console.log(res)
        const url = URL.createObjectURL(res.data);
        setPdf(url);
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

  return (
    <div>
      {
        pdf ? (
          <object
            data={pdf}
            type="application/pdf"
            width="100%"
            height="600px"
          >
            <p>
              Your browser does not support PDFs. Please{" "}
              <a href={pdf}>download the PDF</a>.
            </p>
          </object>

        ) : (
          <div>Loading pdf...</div>
        )
      }
    </div>
  )
};

export default Pdf;