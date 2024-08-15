import { useNavigate } from "react-router-dom"

export function BottomWarning({label, buttonText, toRoute}) {
  const navigate=useNavigate();
    return <div className="py-2 text-sm flex justify-center">
      <div>
        {label}
      </div>
      <span className="pointer underline pl-1 cursor-pointer" onClick={(e)=>{
          navigate(`${toRoute}`)
        }}>
        {buttonText}
      </span>
    </div>
}