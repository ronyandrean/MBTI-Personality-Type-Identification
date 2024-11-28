import React, { useState, useRef, useEffect } from 'react';
import './Main.css';
import { CircleArrowRight, CircleHelp, Download } from 'lucide-react';
import { assets } from '../Image/assets.js';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, scales } from 'chart.js';
import html2pdf from 'html2pdf.js';

// Registering the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Main = () => {
  const [userInput, setUserInput] = useState('');
  const [probabilities, setProbabilities] = useState({});
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    if (Object.keys(probabilities).length > 0 && chartRef.current) {
      chartRef.current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [probabilities]);

  const handleHelpClick = () => {
    setShowHelp(!showHelp);
  };

  const handleClose = () => {
    setShowHelp(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult('');
    setProbabilities({});

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        text: userInput,
      });

      if (response.data && response.data.mbti_type) {
        setResult(`Predicted MBTI Type: ${response.data.mbti_type}`);
        setProbabilities(response.data.probabilities);
      } else {
        setError('Error: Invalid response from the backend');
      }
    } catch (err) {
      setError('Error: Unable to get a prediction. Please try again.');
      console.error(err);
    }
  };

  const mbtiTypes = Object.keys(probabilities);
  const mbtiValues = Object.values(probabilities).map(prob => Number((prob * 100).toFixed(2)));

  const highestIndex = mbtiValues.indexOf(Math.max(...mbtiValues));

  const colors = mbtiValues.map((_, index) =>
    index === highestIndex ? 'rgba(223, 164, 17, 0.2)' : 'rgba(75, 192, 192, 0.2)'
  );
  const borderColors = mbtiValues.map((_, index) =>
    index === highestIndex ? 'rgba(223, 164, 17, 1)' : 'rgba(75, 192, 192, 1)'
  );

  const chartData = {
    labels: mbtiTypes,
    datasets: [
      {
        label: 'MBTI Probability (%)',
        data: mbtiValues,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const downloadPDF = () => {
    const element = chartRef.current;
    const options = {
      filename: 'your_mbti.pdf', 
      
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    html2pdf()
    .from(element)
    .set(options)
    .toPdf()
    .get('pdf')
    .save();
  };

  return (
    <div className="main">
      <div className='logo-container'>
        <div className="logo">
          <img src={assets.logo_icon} alt="Haven logo" width={140} height={140} className="logo_shape" />
          <span className="logo_name">Haven.</span>
        </div>
        <CircleHelp width={50} height={50} className='help-icon' onClick={handleHelpClick}/>
      </div>

      {showHelp && (
        <div className="modal-overlay">
          <div className="modal">
          <h3>How to Use the MBTI Prediction</h3>
          <p>Follow these steps to predict your MBTI type:</p>
          <ol>
            <li>1. <strong>Type a brief description of your personality</strong>. Share how you think or behave in different situations, such as at work, in social settings, or when facing challenges.</li>
            <br></br>
            <li>2. <strong>Click the "Submit" button</strong>. This will analyzing your input to determine your MBTI personality type.</li>
            <br></br>
            <li>3. <strong>View the predicted MBTI type</strong> Display all probabilities for each MBTI type.</li>
            <br></br>
            <li>4 . <strong>Explore more about your MBTI type</strong> and discover helpful resources based on the result.</li>
          </ol>

            <button className="close-button" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* <button className='help'>
        <CircleHelp width={50} height={50}/>
      </button> */}

      <div className="pic1">
        <img src={assets.pic1_icon} alt="Pic logo" width={140} height={140} className="pic1_shape" />
      </div>
      <span className="pic1_name">MBTI Personality Type Identification</span>

      <form onSubmit={handleSubmit}>
        <div className="chatbox-container">
          <div className="chatbox-wrapper">
            <textarea
              className="chatbox"
              placeholder="Explain Yourself to Me"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)} 
              rows={1}
            />
            <button type="submit" className="send-button">
              <CircleArrowRight />
            </button>
          </div>
        </div>
      </form>

      {result && <p className="result">{result}</p>}
      {error && <p className="error">{error}</p>}

      {Object.keys(probabilities).length > 0 && (
        <div className="chart-container" ref={chartRef}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'MBTI Type Prediction Probabilities'
                },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => `${tooltipItem.raw}%`,
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'MBTI Type',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Probability (%)',
                  },
                  min: 0,
                  max: 20,
                  ticks: {
                    stepSize: 2,
                  },
                },
              },
            }}
          />
        </div>
      )}

      {/* {Object.keys(probabilities).length > 0 && !error && (
        <div className='share'>
          <h1>Share your MBTI Personality Type Identification</h1>
          <button className='download-button' onClick={downloadPDF}>
            <p>Download as PDF</p>
          </button>
        </div>
      )} */}

    </div>
  );
};

export default Main;
