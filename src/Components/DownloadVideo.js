import '../Styles/DownloadVideo.css';
import React, { useState } from 'react';
import axios from 'axios';
import sanitizeFilename from 'sanitize-filename';

const DownloadVideo = () => {

    let sourceURL = 'http://localhost:6001';
    // sourceURL = 'https://downloader-i213.onrender.com';

    const [URL, setUrl] = useState('');
    const [loading, setLoading] = useState('');
    const [error, setError] = useState(null);

    // Function to simulate ytdl.getInfo in frontend
    const getVideoInfo = async (videoURL) => {
        try {
            const response = await axios.post(`${sourceURL}/videoInfo`, { URL: videoURL });
            if(response.data.videoInfo.videoDetails.category === "Music"){
                setError("The link provided has category 'Music'. For better result, 'MP3 Download' is recommended!")
            }
            return response.data.videoInfo;
        } catch (error) {
            console.error('Error fetching video info:', error);
            return null;
        }
    };

    const handleDownloadMP3 = async () => {
        setLoading('mp3');
        setError(null);

        try {
            const videoInfo = await getVideoInfo(URL);

            let sanitizedFilename = "Your Video";
            if (videoInfo) {
                sanitizedFilename = sanitizeFilename(videoInfo.videoDetails.title);
            }

            const response = await axios.post(`${sourceURL}/downloadMP3`, { URL }, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            link.setAttribute('download', `${sanitizedFilename}.mp3`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError('Failed to download audio');
        } finally {
            setLoading('');
        }
    };
    
    const handleDownloadMP4 = async () => {
        setLoading('mp4');
        setError(null);

        try {
            const videoInfo = await getVideoInfo(URL);

            let sanitizedFilename = "Your Video";
            if (videoInfo) {
                sanitizedFilename = sanitizeFilename(videoInfo.videoDetails.title);
            }

            const response = await axios.post(`${sourceURL}/downloadMP4`, { URL }, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            link.setAttribute('download', `${sanitizedFilename}.mp4`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError('Failed to download video');
        } finally {
            setLoading('');
        }
    };

    return (
        <div>
            <h1>Download YouTube Video as MP3 or MP4</h1>
            <input
                type="text"
                placeholder="Enter YouTube URL"
                value={URL}
                onChange={(e) => setUrl(e.target.value)}
            />
            <button onClick={handleDownloadMP3} disabled={loading}>
                {loading === 'mp3' ? 'Downloading...' : 'Download MP3 (Audio)'}
            </button>
            <button onClick={handleDownloadMP4} disabled={loading}>
                {loading === 'mp4' ? 'Downloading...' : 'Download MP4 (Video)'}
            </button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default DownloadVideo;
