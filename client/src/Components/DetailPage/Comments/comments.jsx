import React, { Component } from 'react';
import axios from 'axios';
import {Card, Button, List, Image} from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {commentsCss, commentClickCss, commentTitle, commentOverall, cardCss, cardCssLoginLabel, comment_item, commentUser, cardCssRating} from './comments.module.scss'
import {score, imageSection} from '../Introduction/intro.module.scss'
import HorizontalBar from '../Introduction/Bar/bar'
import Rating from '../Rating/rating';

//For log in
import { getCurrentUserContext } from '../../withAuth';
import Signin from '../../Signin/Signin'
import SignOutButton from '../../Signout/Signout';
import {withRouter} from 'react-router-dom';


class Comments extends Component {
    constructor() {
        super();
        this.state = {            
            comments: "undefined",                                       //all comments and corresponding users of the game
            addComment: '',                                     //the comment added by user
            commentClickDisplay: 'block',                       //add comment link, not visible when a comment box appears
            commentBoxDisplay: 'none',                          //comment box, visible when add comment link is clicked
            buttonDisplay: 'none',                              //submit and cancel button, visible when add comment link is clicked
            loginLabel: <p>Loading login status....</p>,
            email: 'undefined',
            id: 'undefined',
            username: 'undefined',
        }
        this.addComment = this.addComment.bind(this);           //click to add a comment box
        this.writeComment = this.writeComment.bind(this);       //input change handler of the comment box
        this.submit = this.submit.bind(this);                   //submit comment handler
        this.cancel = this.cancel.bind(this);                   //cancel commenting handler
    }

    componentDidMount() {
        axios.get('api/game/' + this.props.appid)
        .then(response => {
  
            this.setState({          
                comments: response.data.data.comment.reverse()
            })
        }).catch(err => {
            alert(err)
        })


         //first time render default email and id
        if(localStorage.getItem('currentUser') != null){
            this.setState({
                email: JSON.parse(localStorage.getItem('currentUser')).email,
                id: JSON.parse(localStorage.getItem('currentUser')).uid
            })
        }
        
        this.setState({
            loginLabel : 
              <getCurrentUserContext.Consumer>
                {
                  currentUser =>{
                    if(currentUser != null){
                        this.setState({
                            email: JSON.parse(localStorage.getItem('currentUser')).email,
                            id: JSON.parse(localStorage.getItem('currentUser')).uid
                        })
                        //get username
                        axios.get('api/user/' + currentUser.uid)
                        .then(response => {
                            
                            this.setState({         
                                username: response.data.data.name,
                                
                            })
                        
                        }).catch(err => {
                            alert(err)
                        })
                      return(
                        <div>
                            <h3>Welcome! {currentUser.email}</h3>
                            <SignOutButton></SignOutButton>
                        </div>
                        
                      )
                    } else{
                        this.setState({
                            email: 'undefined',
                            id: 'undefined'
                        })
                        
                      return (
                        <div>
                            <Signin>
                            </Signin>
                            <p>Don't have an account?</p>
                            <Button primary onClick={()=>this.props.history.push("/signup")}>Sign up</Button>
                        </div>
                        
                      )
                    } 
                  }
                  
                }
              </getCurrentUserContext.Consumer>
        
          })
    }

    componentDidUpdate() {
        axios.get('api/game/' + this.props.appid)
        .then(response => {
            this.setState({          
                comments: response.data.data.comment.reverse()
            })
        }).catch(err => {
            alert(err)
        })

        
    }

    addComment() {
        this.setState({
             commentBoxDisplay: 'block',
             buttonDisplay: 'inline',
             commentClickDisplay: 'none',
        })
     }

     //write the comment into the text box
     writeComment(event) {
         if (event.target.value.length >= 1000) {
             alert('Reach maximum character limits');
             return;
         }
         this.setState({
             addComment: event.target.value,
         })
     }

    //submit the comment, axios post should be added here 
    submit() {
        let commentList = []
        if(this.state.comments != "undefined"){
            commentList = this.state.comments;

        }
        commentList.push(this.state.addComment);
        //check loged in or not
        if (this.state.email == "undefined" || this.state.id == "undefined"){
            alert("Please log in to comment")
            return;
        }
        // empty comment will raise alert
        if (this.state.addComment === '') {
            alert('Please add comments');
            return;
        }
        
        // add date
        let now = new Date();
        var day = String(now.getDate()).padStart(2, '0');
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var year = now.getFullYear();
        var time = now.toTimeString();
        var currentDate =  month + '/' + day + '/' + year + " at " + time;

        this.setState ({
             commentBoxDisplay: 'none',
             buttonDisplay: 'none',
             addComment: '',
             comments: commentList,
             commentClickDisplay: 'block',
         })
         //add comment to game
        axios.put('api/game/comment/' + this.props.appid, {
            comment: this.state.addComment,
            user_name: this.state.username,
            user_id: this.state.id,
            date: currentDate,
            game_name: this.props.name
        })
        //bind comment to user
        axios.put('api/user/comment/' + this.props.appid, {
            comment: this.state.addComment,
            user_name: this.state.username,
            user_id: this.state.id,
            date: currentDate,
            game_name: this.props.name
        })
     }

     //cancel the comment
     cancel() {
         this.setState({
             commentBoxDisplay: 'none',
             buttonDisplay: 'none',
             addComment: '',
             commentClickDisplay: 'block',
         })
     }

     //click comment to the user
     transfer_user(user_id){
         this.props.history.push("/account/" + user_id);
     }
     render() {
        //Add a comment is invisible when a comment box is visible
        let commentClickStyle = {
            display: this.state.commentClickDisplay
        }
         //comment box is visible when add a comment is clicked
        let commentBoxStyle = {
            display: this.state.commentBoxDisplay
        }
        //button is visible when add a comment is clicked
        let buttonDisplayStyle = {
            display: this.state.buttonDisplay
        }

        let commentLists = <p>Be the very first one to comment! </p>;

        if(this.state.comments == "undefined"){
            commentLists = <p>Loading...</p>;
        } else if(this.state.comments.length > 0){
            commentLists = this.state.comments.map((currComment) => {

                var currDate = () => {
                    if(currComment.date){
                        return currComment.date;
                    } else{
                        return "Unknown date"
                    }
                }
    
                return (
                    <List.Item className = {comment_item} onClick = {() => this.transfer_user(currComment.user_id)}>
                        <Image avatar src='https://react.semantic-ui.com/images/avatar/small/daniel.jpg' />
                        <List.Content>
                            <List.Header>{currComment.user_name }</List.Header>
                            <p>{" Commented on " + currDate()}</p>
                            <List.Description>
                                {currComment.comment}
                            </List.Description>
                        </List.Content>
                    </List.Item>
                );
            })
        }


        let commentInvalid = this.state.username == "undefined"

        let commentName = ()=>{
            if(commentInvalid){
                return "Please log in to comment"
            } else{
                return "You are commenting as " + this.state.username;
            }
        }

        return(
            <div className={commentOverall}>
                <Card className={cardCssLoginLabel}>
                    {this.state.loginLabel}

                </Card>
                <div className={imageSection}>
                    <Rating appid = {this.props.appid}/>
                    <div className = {score}>
                        <HorizontalBar appid = {this.props.appid}/>
                    </div>
                </div>
                <Card className={cardCss}>
                    <span className = {commentTitle}>Comments</span>
                    <span className = {commentUser}>{commentName()}</span>
                    <Card.Content className = {commentsCss}>
                        <Card.Header className = {commentClickCss} onClick = {this.addComment} style = {commentClickStyle}>
                            <FontAwesomeIcon icon="comment-alt"/> Add a comment
                        </Card.Header>
                        <textarea name="commentBox" maxlength = '1000' onChange = {this.writeComment} 
                        value = {this.state.addComment} style = {commentBoxStyle}></textarea>
                        <Button onClick = {this.submit} disabled = {commentInvalid} style = {buttonDisplayStyle}>Submit</Button>  
                        <Button onClick = {this.cancel} style = {buttonDisplayStyle}>Cancel</Button>
                        <List relaxed='very' animated>
                            {commentLists}
                        </List>
                    </Card.Content>
                </Card>
            </div>
        )
     }
}

export default withRouter(Comments);