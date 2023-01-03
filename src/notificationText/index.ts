 
import {Templates} from "./templates";

/**
 * @description this function takes the template beng passed and appensds it to the layout template while attaching dynamic variables passed into teh function
 * @param mailTemplate layout file name
 * @param data data passed
 * @returns
 */
export const templatIntoLayouteMail =  (
  mailTemplate: string,
  data: {
    [key: string]: number | string | [] |void;
  }
) => {
  try {
    const emailTemplate  =  fillTmplatteUpWithData(mailTemplate,data);  
    
    const layoutTemplate =   fillTmplatteUpWithData("layout",{});  

 
    const template = layoutTemplate.replace("////*/emailTemplate/*///", emailTemplate); //// replace seamed beest for this part
   
    return template;
  } catch (error) {
    console.log(error);
    throw new Error("Issues creating mail template");
  }
};


export const fillTmplatteUpWithData = (mailTemplate:string,data :any )=>{
  let template = Templates[mailTemplate];
  if (!template) {
    throw new Error("Issues creating mail template");
  }

  function escapeRegExp(string:string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }
 
  ///add the data
  const list = Object.keys(data);
  list.forEach((text)=>{
    template =  template.replace(  new RegExp(escapeRegExp( `////*/${text}/*///`), "g"),  data[`${text}`]   ); //// replace seamed beest for this part
  });

  return template;
};