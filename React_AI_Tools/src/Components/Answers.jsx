import { useEffect, useState } from "react";
import { checkHeading, replaceHeadingStars, parseInlineBold, isBulletLine, convertBulletToDot } from "../helper";

export const Answers = ({ ans, totalResult, index, type }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);

 useEffect(() => {
  if (checkHeading(ans)) {
    setHeading(true);
    setAnswer(replaceHeadingStars(ans));
  } else if (isBulletLine(ans)) {
  setHeading(false);
  setAnswer(convertBulletToDot(ans));
}
 else {
    setHeading(false);
    setAnswer(ans);
  }
}, [ans]);


  // 🔹 convert parsed text to JSX
  const renderText = (text) =>
    parseInlineBold(text).map((item, i) =>
      item.type === "bold" ? (
        <strong className="dark:text-white  text-znic-950" key={i}>{item.text}</strong>
      ) : (
        <span key={i}>{item.text}</span>
      )
    );
   
  return (
    <>
      {index === 0 && totalResult > 1 ? (
        <span className="pt-2 text-lg block dark:text-white text-zinc-950 font-medium">
          {renderText(answer)}
          
        </span>
      ) : heading ? (
        <span className="pt-2 text-lg block dark:text-white text-zinc-950 font-semibold">
          {renderText(answer)}
          
        </span>
      ) : (
        <span className={type=='q'? 'pl-1':'pl-5 dark:text-zinc-200 text-black'}>
          {renderText(answer)}
         
        </span>
      )}
    </>
  );
};
