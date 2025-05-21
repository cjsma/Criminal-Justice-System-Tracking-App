import React, { useState } from 'react';
import protectionForms from '../data/protectionForms';
import '../styles/ApplyProtectionForm.css';

const ApplyProtectionForm = () => {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="protection-order-page">
      {!accepted ? (
        <div className="terms-box">
          <h2>Terms & Conditions</h2>
          <p>
            Before applying for a Protection Order, please read and accept the
            terms below:
          </p>
          <ul>
            <li>
              This application is governed by the Domestic Violence Act 116 of
              1998 and the Domestic Violence Regulations 2022.
            </li>
            <li>
              Domestic violence includes physical, sexual, emotional,
              psychological or financial abuse; stalking; damage to property;
              unauthorized entry; or any controlling behavior that may cause
              harm.
            </li>
            <li>
              A protection order can prohibit the abuser from contacting you,
              entering your residence or workplace, or committing further acts
              of abuse.
            </li>
            <li>
              Anyone experiencing abuse may apply, including minors and
              individuals acting on behalf of a complainant (e.g., a social
              worker, police officer, or teacher).
            </li>
            <li>
              The application is free of charge and available 24/7 at your
              nearest Magistrate’s Court or High Court.
            </li>
            <li>
              You must complete Forms 6 and 2 and submit an affidavit outlining
              your situation and the requested protection.
            </li>
            <li>
              A protection order remains valid until cancelled by the court. It
              may still be enforced during an appeal process.
            </li>
            <li>
              All information submitted must be truthful and accurate. You may
              be contacted for further clarification.
            </li>
          </ul>
          <button onClick={() => setAccepted(true)} className="accept-button">
            I Accept & Apply
          </button>
        </div>
      ) : (
        <div className="form-list-box">
          <h2>Protection Order Application Forms</h2>
          <p>Click below to download the necessary forms:</p>
          <div className="forms-grid">
            {protectionForms.map((form, index) => (
              <a
                key={index}
                href={form.link}
                target="_blank"
                rel="noopener noreferrer"
                className="form-card"
              >
                <strong>{form.title}</strong>
                <p>{form.description}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyProtectionForm;
