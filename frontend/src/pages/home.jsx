import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { addToUserHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        // Validate meeting code
        if (!meetingCode.trim()) {
            setError("Please enter a meeting code");
            return;
        }

        try {
            setLoading(true);
            setError("");
            
            // Add to user history
            await addToUserHistory(meetingCode);
            
            // Navigate to the meeting
            navigate(`/${meetingCode}`);
        } catch (error) {
            console.error("Error joining video call:", error);
            setError("Failed to join meeting. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = () => {
        try {
            localStorage.removeItem("token");
            navigate("/auth");
        } catch (error) {
            console.error("Error during logout:", error);
            // Still navigate to auth even if localStorage fails
            navigate("/auth");
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleJoinVideoCall();
        }
    }

    return (
        <>
            <div className="navBar">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h2>Video Call</h2>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <IconButton 
                        onClick={() => navigate("/history")}
                        title="View History"
                    >
                        <RestoreIcon />
                    </IconButton>
                    <p style={{ margin: 0 }}>History</p>

                    <Button 
                        onClick={handleLogout}
                        variant="outlined"
                        color="error"
                    >
                        Logout
                    </Button>
                </div>
            </div>

            <div className="meetContainer">
                <div className="leftPanel">
                    <div>
                        <h2>Providing Quality Video Call Just Like Quality Education</h2>

                        <div style={{ display: 'flex', gap: "10px", alignItems: "flex-start" }}>
                            <TextField 
                                value={meetingCode}
                                onChange={e => {
                                    setMeetingCode(e.target.value);
                                    setError(""); // Clear error when user types
                                }}
                                onKeyPress={handleKeyPress}
                                id="outlined-basic" 
                                label="Meeting Code" 
                                variant="outlined"
                                error={!!error}
                                helperText={error}
                                disabled={loading}
                                fullWidth
                            />
                            <Button 
                                onClick={handleJoinVideoCall} 
                                variant='contained'
                                disabled={loading || !meetingCode.trim()}
                                style={{ minWidth: "100px" }}
                            >
                                {loading ? "Joining..." : "Join"}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='rightPanel'>
                    <img 
                        src='logo3.png' 
                        alt="Video Call Logo" 
                        style={{ maxWidth: "100%", height: "auto" }}
                    />
                </div>
            </div>
        </>
    )
}

export default withAuth(HomeComponent)