import React, { useState} from 'react';

function Obituary({ setShowObituary, obituaries,setObituaries }) {
    const [name, setName] = useState('');
    const [born, setBorn] = useState('');
    const [died, setDied] = useState('');
    const [image, setImage] = useState('');
    const [nameError, setNameError] = useState(false);
    const [bornError, setBornError] = useState(false);
    const [diedError, setDiedError] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isGeneratingObituary, setIsGeneratingObituary] = useState(false);
    const disabledButtonClass = 'disabled-button';
    
    const handleWriteObituaryClick = async () => {
      const name = document.getElementById('name-in').value;
      const born = document.querySelector('.born-cont .date-input').value;
      const died = document.querySelector('.died-cont .date-input').value;
      const image = document.querySelector('#file-input').files[0];
    
      if (!name || !born || !died || !image) {
        // Add a red class to the empty field
        if (!name) setNameError(true);
        if (!born) setBornError(true);
        if (!died) setDiedError(true);
        if (!image) setImageError(true);
        alert('Please fill in all fields');
        return;
      }
      if (new Date(died) < new Date(born)) {
        alert('The death date cannot be before the born date');
        return;
      } else if (new Date(died) > Date.now()) {
        alert('Death date can not be in the future');
        return;
      }
    
      setIsGeneratingObituary(true);
    
      const desc1 = 'DISABLED BECAUSE CHARGING ME 002 centents for every 1000 TOKENS';
    
      const bitmap = await createImageBitmap(image);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext('2d');
      context.filter = 'grayscale(90%)';
      context.drawImage(bitmap, 0, 0);
    
      // Convert the canvas to a data URL and set it as the image URL
      const imageURL1 = canvas.toDataURL();
      const res = await fetch("https://kenivki7a3q34onzcfyy2pqlu40izjol.lambda-url.ca-central-1.on.aws/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          id: Date.now().toString(),
          birthdate: born,
          deathdate: died,
          image: imageURL1,
          description: desc1,
        }),
      });
    
      const data1 = await res.json();
      const imageURL = data1.image;
      const desc = data1.description;
      const pollyurl = data1.pollyurl;
      const newObituary = { name, born, died, imageURL, desc, pollyurl };
    
      // Add the new obituary to the array of obituaries
      setObituaries([...obituaries, newObituary]);
    
      // Clear the input fields
      document.getElementById('name-in').value = '';
      document.querySelector('.born-cont .date-input').value = '';
      document.querySelector('.died-cont .date-input').value = '';
      document.querySelector('#file-input').value = '';
      document.querySelector('#file-name').textContent = '';
      setShowObituary(false);
      setIsGeneratingObituary(false);
    };
    

    const buttonClassName = isGeneratingObituary ? disabledButtonClass : 'write-obituary';

    const handleRemoveClick = () => {
    setShowObituary(false);
    };

    const handleNameChange = (event) => {
    setName(event.target.value);
    setNameError(false);
    };

    const handleBornChange = (event) => {
    setBorn(event.target.value);
    setBornError(false);
    };

    const handleDiedChange = (event) => {
    setDied(event.target.value);
    setDiedError(false);
    };

    return (
    <>
     <div className="exit-x" onClick={handleRemoveClick}>
       <h3 id="x-character">&#10005;</h3>
     </div>
     <div className="obituary-create-cont">
       <div className="obituary-head">
         <h2 id="create-new-title">Create a New Obituary</h2>
         <img id="obituary-img" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5rA95_uWy9bYBGw21EuNYM2whL0PgyZnlhpzqxwJQzlQO8ukLPCoAFIuTsIaBtZXRtT8&usqp=CAU" alt='flowers' />
       </div>
       <div className="img-select-cont">
       <a href="#" id="img-select" onClick={() => {document.getElementById('file-input').click(); setImageError(false)}} style={{ color: imageError ? 'red' : 'initial' }}>
           Select an image for the deceased
           <span id="file-name"></span>
         </a>
         <input type="file" id="file-input" accept="image/*" style={{ display: 'none' }} onChange={(e) => (document.getElementById('file-name').textContent = `(${e.target.files[0].name})`)} />
       </div>
       <div className="name-in-cont">
         <input id="name-in" type="text" placeholder="Name of the deceased" value={name} onChange={handleNameChange} style={{ borderColor: nameError ? 'red' : 'initial' }}/>
       </div>
       <div className="age-cont">
         <div className="born-cont">
           <p>
             <i>
               <b>Born:</b>
             </i>
           </p>
           <input
            className="date-input"
            type="datetime-local"
            style={{ color: bornError ? 'red' : 'initial' }}
            onChange={handleBornChange} />
         </div>
         <div className="died-cont">
           <p>
             <i>
               <b>Died:</b>
             </i>
           </p>
           <input
           className="date-input"
           type="datetime-local"
           style={{ color: diedError ? 'red' : 'initial' }}
           onChange={handleDiedChange} />
         </div>
       </div>
       <div className="write-btn-cont">
       <button
        id={buttonClassName}
        onClick={handleWriteObituaryClick}
        disabled={isGeneratingObituary} >
        {isGeneratingObituary ? 'Generating Obituary...' : 'Write Obituary'}
      </button>
           </div>
       </div>
       </>
   )
}

export default Obituary;