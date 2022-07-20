import { NavigationContainer } from "@react-navigation/native";
import { SignIn } from "../screens/SignIn";

export function Routes(){
  return(
    <NavigationContainer>
      <SignIn/>
    </NavigationContainer>
  )
}