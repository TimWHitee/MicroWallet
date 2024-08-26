import { useNavigate } from "react-router-dom";
import "./MainMenu.css";

export default function MainMenu() {
  const navigate = useNavigate();

  return (
    <div className="main-menu">
      <h1>MicroWallet</h1>
      <h2>the only wallet you need</h2>

      <button onClick={() => navigate("/show-mnemo")}>Create Wallet</button>
      <button onClick={() => navigate("/import")}>Import Wallet</button>
    </div>
  );
}
