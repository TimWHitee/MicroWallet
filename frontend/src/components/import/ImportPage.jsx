import { useNavigate } from "react-router-dom";
import "./ImportPage.css";

export default function Registration() {
  const navigate = useNavigate();

  return (
    <div className="import-container">
      <h3>Choose import path</h3>

      <button onClick={() => navigate("/import/mnemonic")}>
        Mnemonic phrase
      </button>
      <button onClick={() => navigate("/import/private")}>Private key</button>
    </div>
  );
}
