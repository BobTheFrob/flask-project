import { useAuth } from "./UserProvider";
import { BasicBSSpinner } from "../pages/Base";

export default function LoadingPageSection ({ content, loadingText, contentText }) {
    const {user, userLoading} = useAuth()

    return (
        userLoading?
            <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center pt-5">
            <BasicBSSpinner styles={{width: "5rem", height: "5rem"}}></BasicBSSpinner> 
            <p className="pt-3">{loadingText}</p>
            </div>
        : 
            user? content : (<p>Please log in to see {contentText}</p>)
    )

}