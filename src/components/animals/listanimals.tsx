import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Link, Redirect} from 'react-router-dom';

import {Button, Container, Grid, Image} from 'semantic-ui-react';

class ListAnimals extends React.Component {
    constructor(props) {
        super(props);
        this.onSponsorClick = this.onSponsorClick.bind(this);
    }
    
    onSponsorClick(event, data) {
        // data is both {} and a key:value collection
        // For example:
        // data.label === "Sponsor"
        // data["animalId"] === 23

        console.log(data);
        console.log(data["animinalId"]);        
    }

    buttonAs() {
        return(<Link to="/animals/new" >New</Link>);
    }
    render() {
        return <Container>
            <h2>Animal Rescurers! We need YOU!</h2>
            
            <Grid stretched container>
                <Grid.Row columns="3" stretched>
                    <Grid.Column >
                        <Image size="massive" src="../assets/images/polar-bear-hero.jpg"/>
                    </Grid.Column>
                    <Grid.Column>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris feugiat nunc massa, sed volutpat elit viverra at.
                        Maecenas tristique, ligula vel dignissim hendrerit, ipsum tellus molestie est, in bibendum massa arcu pretium orci.
                        Integer tempor imperdiet erat eu euismod. Cras efficitur ligula nec vestibulum commodo. Ut a lacus vel felis molestie
                        elementum. Aliquam erat volutpat. Donec pretium aliquet dapibus. Morbi auctor feugiat sagittis. Nulla nisl augue,
                        tempor ac lacus vitae, condimentum volutpat neque. Phasellus rutrum erat nec dui accumsan laoreet. Suspendisse
                        in venenatis risus, sed tincidunt nunc. Sed porta quis justo at placerat. Mauris eget odio quis quam imperdiet sagittis.
                    </Grid.Column>
                    <Grid.Column>
                        100
                    </Grid.Column>
                    <Grid.Column>
                        <Button animalId={23} label="Sponsor" as={this.buttonAs} onClick={this.onSponsorClick} />
                    </Grid.Column>
                </Grid.Row>                
                <Grid.Row columns="3" stretched>
                    <Grid.Column >
                        <Image size="massive" src="../assets/images/African_Elephant_7.27.2012_hero_and_circle_HI_53941.jpg"/>
                    </Grid.Column>
                    <Grid.Column>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris feugiat nunc massa, sed volutpat elit viverra at.
                        Maecenas tristique, ligula vel dignissim hendrerit, ipsum tellus molestie est, in bibendum massa arcu pretium orci.
                        Integer tempor imperdiet erat eu euismod. Cras efficitur ligula nec vestibulum commodo. Ut a lacus vel felis molestie
                        elementum. Aliquam erat volutpat. Donec pretium aliquet dapibus. Morbi auctor feugiat sagittis. Nulla nisl augue,
                        tempor ac lacus vitae, condimentum volutpat neque. Phasellus rutrum erat nec dui accumsan laoreet. Suspendisse
                        in venenatis risus, sed tincidunt nunc. Sed porta quis justo at placerat. Mauris eget odio quis quam imperdiet sagittis.
                    </Grid.Column>
                    <Grid.Column>
                        100
                    </Grid.Column>
                    <Grid.Column>
                        Sponsor
                    </Grid.Column>
                </Grid.Row>                
                <Grid.Row columns="3" stretched>
                    <Grid.Column >
                        <Image size="massive" src="../assets/images/Black_Rhino_8.6.2012_Hero_and_Circle_HI_48366.jpg"/>
                    </Grid.Column>
                    <Grid.Column>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris feugiat nunc massa, sed volutpat elit viverra at.
                        Maecenas tristique, ligula vel dignissim hendrerit, ipsum tellus molestie est, in bibendum massa arcu pretium orci.
                        Integer tempor imperdiet erat eu euismod. Cras efficitur ligula nec vestibulum commodo. Ut a lacus vel felis molestie
                        elementum. Aliquam erat volutpat. Donec pretium aliquet dapibus. Morbi auctor feugiat sagittis. Nulla nisl augue,
                        tempor ac lacus vitae, condimentum volutpat neque. Phasellus rutrum erat nec dui accumsan laoreet. Suspendisse
                        in venenatis risus, sed tincidunt nunc. Sed porta quis justo at placerat. Mauris eget odio quis quam imperdiet sagittis.
                    </Grid.Column>
                    <Grid.Column>
                        100
                    </Grid.Column>
                    <Grid.Column>
                        Sponsor
                    </Grid.Column>
                </Grid.Row>                
                <Grid.Row columns="3" stretched>
                    <Grid.Column >
                        <Image size="massive" src="../assets/images/Green_Turtle_Hero_image_260214.jpg"/>
                    </Grid.Column>
                    <Grid.Column>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris feugiat nunc massa, sed volutpat elit viverra at.
                        Maecenas tristique, ligula vel dignissim hendrerit, ipsum tellus molestie est, in bibendum massa arcu pretium orci.
                        Integer tempor imperdiet erat eu euismod. Cras efficitur ligula nec vestibulum commodo. Ut a lacus vel felis molestie
                        elementum. Aliquam erat volutpat. Donec pretium aliquet dapibus. Morbi auctor feugiat sagittis. Nulla nisl augue,
                        tempor ac lacus vitae, condimentum volutpat neque. Phasellus rutrum erat nec dui accumsan laoreet. Suspendisse
                        in venenatis risus, sed tincidunt nunc. Sed porta quis justo at placerat. Mauris eget odio quis quam imperdiet sagittis.
                    </Grid.Column>
                    <Grid.Column>
                        100
                    </Grid.Column>
                    <Grid.Column>
                        Sponsor
                    </Grid.Column>
                </Grid.Row>                
            </Grid>
        </Container>;
    }
}

export {ListAnimals as default, ListAnimals};