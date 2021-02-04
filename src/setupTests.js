import {configure} from "enzyme"
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"

configure({adapter : new Adapter()})

const fbScript = document.createElement('script')
fbScript.id = 'facebook-jssdk'
document.body.appendChild(fbScript)
