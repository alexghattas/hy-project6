import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Link } from 'react-router';

const config = {
    apiKey: "AIzaSyCmJQCkXSbER97FFay1iVSaaryybUxT06A",
    authDomain: "hy-project6.firebaseapp.com",
    databaseURL: "https://hy-project6.firebaseio.com",
    storageBucket: "hy-project6.appspot.com",
    messagingSenderId: "493637657944"
  };
  firebase.initializeApp(config);


function Nav() {
	return (
		<header>
			<nav>
				Logo Goes Here
			</nav>
		</header>
	)
}

function Post(props) {
	return (
		<li>
			<i className="fa fa-trash" onClick={() => props.removePost(props.data.key)}></i>
			<h1>{props.data.title}</h1>
			<p>{props.data.content}</p>
		</li>
	)
}


class App extends React.Component {
	constructor() {
		super()
		this.state = {
			posts: []
		}
		this.addPost = this.addPost.bind(this);
		this.removePost = this.removePost.bind(this);
	}
	componentDidMount() {
		firebase.database().ref().on('value', (res) => {
			const userData = res.val();
			const dataArray = [];
			for(let objKey in userData) {
				userData[objKey].key = objKey;
				dataArray.push(userData[objKey])
			}
			this.setState({
				posts: dataArray
			})
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
	}
	removePost(post) {
		const dbRef = firebase.database().ref(post);
		dbRef.remove();
	}
	render() {
		return (
			<div>
				<Nav />
				<form onSubmit={this.addPost}>
					<input type="text" name="post-title" placeholder='Blog Title' ref={ref => this.postTitle = ref}/>
					<input type="text" name="post-content" placeholder='Blog Content' ref={ref => this.postContent = ref}/>
					<input type="submit" value="Create Post"/>
				</form>
				<ul>
					{this.state.posts.map((item) => {
						return <Post data={item} key={item.key} removePost={this.removePost}/>
					})}
				</ul>
			</div>
		)
	}
}

class Blog extends React.Component {
	constructor() {
			super()
			this.state = {
				posts: []
			}
		}
		componentDidMount() {
			firebase.database().ref().on('value', (res) => {
				const userData = res.val();
				const dataArray = [];
				for(let objKey in userData) {
					userData[objKey].key = objKey;
					dataArray.push(userData[objKey])
				}
				this.setState({
					posts: dataArray
				})
			});
		}
	render() {
		return (
			<div>
			<ul>
					{this.state.posts.map((item) => {
						return <BlogPost data={item} key={item.key} removePost={this.removePost}/>
					})}
				</ul>
			</div>
		)
	}
}

function BlogPost(props) {
	return (
		<div>
			<h1>Welcome to my blog</h1>
			<li>
				<h1>{props.data.title}</h1>
				<p>{props.data.content}</p>
			</li>
		</div>
	)
}



ReactDOM.render(
<Router history={browserHistory}>
    <Route path="/" component={App} />
    <Route path="/blog" component={Blog} />
	{/*<Route path="/blog/:blog_id">*/}
</Router>, document.getElementById('app'));
