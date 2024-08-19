import { useState } from "react";
import RedirectRequest from "./redirect";
import { useNavigate } from "react-router-dom";

export default function PrivateKey() {
  const [privateKey, setPrivate] = useState("");
  const navigate = useNavigate();

  const handleState = (event) => {
    setPrivate(event.target.value);
  };

  return (
    <div>
      <h3>Import with Private Key</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>Private Key:</label>
        <input
          type="text"
          className=""
          value={privateKey}
          onChange={handleState}
        />
        <button
          onClick={() =>
            RedirectRequest(
              privateKey,
              "http://localhost:8000/",
              "/wallet",
              navigate
            )
          }
        >
          Import wallet
        </button>
      </form>

      <h3>Private Key: {privateKey}</h3>
    </div>
  );
}
