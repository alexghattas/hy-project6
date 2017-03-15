import React from 'react';
import ReactDOM from 'react-dom';

const config = {
    apiKey: "AIzaSyCmJQCkXSbER97FFay1iVSaaryybUxT06A",
    authDomain: "hy-project6.firebaseapp.com",
    databaseURL: "https://hy-project6.firebaseio.com",
    storageBucket: "hy-project6.appspot.com",
    messagingSenderId: "493637657944"
  };
  firebase.initializeApp(config);

class App extends React.Component {
	constructor() {
		super()
		this.state = {
			posts: []
		}
		this.addPost = this.addPost.bind(this);
		this.displayPost = this.displayPost.bind(this);
	}
	componentDidMount() {
		firebase.database().ref().on('value', (res) => {
			console.log(res.val());
		});
	}
	addPost(e) {
		e.preventDefault();

		const post = {
			title: this.postTitle.value,
			content: this.postContent.value
		}
		const dbRef = firebase.database().ref();
		dbRef.push(post);

		const newPosts = Array.from(this.state.posts);
		newPosts.push(post);
		this.setState({
			posts: newPosts
		})
	}
	displayPost() {

	}
	render() {
		return (
			<div>
				<form onSubmit={this.addPost}>
					<input type="text" name="post-title" placeholder='Blog Title' ref={ref => this.postTitle = ref}/>
					<input type="text" name="post-content" placeholder='Blog Content' ref={ref => this.postContent = ref}/>
					<input type="submit" value="Create Post"/>
				</form>
				<section>
					<div>Blog Title</div>
					<div>Blog Content</div>
				</section>
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'))
