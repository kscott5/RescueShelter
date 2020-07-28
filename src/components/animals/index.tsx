import * as React from "react";
import * as ReactDOM from "react-dom";

import ListAnimals from "./listanimals";
import NewAnimal from "./newanimal"

export function ListAnimalsView() { return <ListAnimals />; }
export function NewEditAnimalView(props) { 
      return <NewAnimal props={props} animalId={props.match.params.id||0}/>;
}