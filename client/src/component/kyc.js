import React, { useState, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  font-family: 'Roboto', sans-serif;
`;

const Header = styled.header`
  background-color: #20232a;
  color: #fff;
  padding: 15px 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: relative;
  z-index: 1;
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 2;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
`;

const NavLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
`;

const NavLinkItem = styled.li`
  margin-right: 20px;
`;

const NavLink = styled.a`
  color: #fff;
  text-decoration: none;
  font-size: 18px;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #61dafb;
  }
`;

const VideoContainer = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  margin: 0 10px;
  padding: 12px 24px;
  background-color: #61dafb;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3d91cf;
  }
`;

const MediaPreview = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const MediaItem = styled.div`
  margin-right: 20px;
`;

const MediaTitle = styled.h2`
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 600;
  color: #20232a;
`;

const Image = styled.img`
  max-width: 300px;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Video = styled.video`
  max-width: 300px;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

function KYC() {
  const [videoBlob, setVideoBlob] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const videoRef = useRef(null);

  const handleVideoCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setVideoBlob(blob);
      };

      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000); // Capturing for 5 seconds

      // Display live video stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error capturing video:', error);
    }
  };

  const handleImageCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
  
      video.srcObject = stream;
      video.onloadedmetadata = async () => {
        // Wait for the video metadata to load
        await video.play();
  
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
        // Convert canvas content to data URL
        const dataURL = canvas.toDataURL('image/jpeg', 0.95);
  
        // Convert data URL to Blob
        const byteString = atob(dataURL.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: 'image/jpeg' });
  
        // Set the captured image blob
        setImageBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };
  

  const handleSubmit = async () => {
    if (videoBlob && imageBlob) {
      const formData = new FormData();
      formData.append('video', videoBlob, 'video.webm');
      formData.append('image', imageBlob, 'image.jpeg');
      

      try {
       let axio = await axios.post('http://localhost:5000/api/kyc', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(axio,"--------------------------")
        alert('KYC submitted successfully!');
      } catch (error) {
        console.error('Error submitting KYC:', error);
        alert('Failed to submit KYC');
      }
    } else {
      alert('Please capture both video and image.');
    }
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Logo>KYC Verification</Logo>
          <NavLinks>
            <NavLinkItem>
              <NavLink href="#">Home</NavLink>
            </NavLinkItem>
            <NavLinkItem>
              <NavLink href="#">About</NavLink>
            </NavLinkItem>
            <NavLinkItem>
              <NavLink href="#">Contact</NavLink>
            </NavLinkItem>
          </NavLinks>
        </HeaderContent>
      </Header>
      <VideoContainer>
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto' }} />
      </VideoContainer>
      <ButtonContainer>
        <Button onClick={handleVideoCapture}>Capture Video</Button>
        <Button onClick={handleImageCapture}>Capture Image</Button>
        <Button onClick={handleSubmit}>Submit KYC</Button>
      </ButtonContainer>
      <MediaPreview>
        <MediaItem>
          <MediaTitle>Video Preview</MediaTitle>
          {videoBlob && <Video controls src={URL.createObjectURL(videoBlob)} />}
        </MediaItem>
        <MediaItem>
          <MediaTitle>Image Preview</MediaTitle>
          {imageBlob && <Image src={URL.createObjectURL(imageBlob)} alt="Captured Image" />}
        </MediaItem>
      </MediaPreview>
    </Container>
  );
}

export default KYC;
