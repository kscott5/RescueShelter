import * as React from "react";
import * as ReactDOM from "react-dom";
import {Link, Route} from "react-router-dom";

import {ListAnimals} from "./listanimals";
import {NewAnimal} from "./newanimal"


export function ListAnimalsView() { 
    return <ListAnimals>
        <div>
           
        </div>

     </ListAnimals>;
}
export function AddNewAnimalView() { return <NewAnimal/>;}