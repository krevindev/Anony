import { Link } from "react-router-dom";
import './NotFound.css';

export default function NotFound() {
    return (
        <div id="NotFound" className="anony-page">
            <h1>Page Not Found</h1>
            <Link to="/">Return Home</Link>
        </div>
    )
}