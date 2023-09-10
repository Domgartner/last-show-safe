import Head from './Head';
import { useEffect, useState } from "react";
import Empty from './Empty';
import Obituary from './Obituary'
import ObituaryItem from './ObituaryItem';
import { RingLoader } from 'react-spinners';

function Layout() {
  const [obituaries, setObituaries] = useState([]);
  const [showObituary, setShowObituary] = useState(false);
  const mostRecentObituary = obituaries[obituaries.length -1];
  const handleAddNewClick = () => {
  setShowObituary(true);
  }

  const handleObituaryAdd = (obituary) => {
   setObituaries([...obituaries, obituary]);
   setShowObituary(false);
  }
   const [isLoading, setIsLoading] = useState(true);


  const getObituaries = () => {
   fetch("https://pdjdr4a77ulhuxsygqdbfqxxce0rrlyi.lambda-url.ca-central-1.on.aws/",{
     method:"GET",
   })
     .then((response)=>{return response.json();})
     .then((data)=>{
       console.log(data);
       // Sort the obituaries in descending order based on the times created
       const sortObituary = data.sort((a, b) => a.id - b.id);
       setObituaries(sortObituary);
       setIsLoading(false);
     })
 }

    useEffect(() => {
     setTimeout(() => {
     setIsLoading(true);
     getObituaries();
   }, 700);
   }, []);
  
    return (
   <>
   <div className={showObituary ? "container obituary-open" : "container"}>
     <div className="content">
       <Head onAddNewClick={handleAddNewClick} />
       {obituaries.length === 0 && !isLoading && <Empty />}
       <div className="obituary-list">
         {obituaries.map((obituary, index) => (
           <div key={index}>
             <ObituaryItem obituary={obituary} mostRecentObituary={mostRecentObituary} />
           </div>
         ))}
       </div>
       {isLoading && obituaries.length === 0 && (
         <div className="spinner">
           <RingLoader color={"#123abc"} loading={isLoading} />
         </div>
       )}
     </div>
   </div>
   {showObituary && (
     <Obituary
       setShowObituary={setShowObituary}
       onAdd={handleObituaryAdd}
       obituaries={obituaries}
       setObituaries={setObituaries}
     />
   )}
  </>
 );      
  }

export default Layout;