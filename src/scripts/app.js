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



function Post(props) {
	return (
		<li className="dashboard__singlePost">
			<i className="fa fa-trash" onClick={() => props.removePost(props.data.key)}></i>
			<h1>{props.data.title}</h1>
			<p>{props.data.content}</p>
		</li>
	)
}








class App extends React.Component {
	constructor() {
		super();
		this.state = {
			loggedIn: false,
			posts: []
		}
		this.addPost = this.addPost.bind(this);
		this.removePost = this.removePost.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.signUp = this.signUp.bind(this);
		this.logIn = this.logIn.bind(this);
		this.showCreatePost = this.showCreatePost.bind(this);
		this.showCreateUser = this.showCreateUser.bind(this);
		this.signOut = this.signOut.bind(this);
	}
	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
		if(user) {
			firebase.database().ref().on('value', (res) => {
				const userData = res.val();
				const dataArray = [];
				for(let objKey in userData) {
					userData[objKey].key = objKey;
					dataArray.push(userData[objKey])
				}
				this.setState({
					loggedIn: true,
					posts: dataArray
				})
			});
			}
		})
	}
	handleChange(e){
		this.setState({
			[e.target.name]: e.target.value
		})
	}
	showCreatePost(e){
		e.preventDefault();
		this.dashboard__createPost.classList.toggle('show');
	}
	showCreateUser(e){
		e.preventDefault();
		this.dashboard__createUser.classList.toggle('show');
	}
	signUp(e) {
		e.preventDefault();
		if(this.state.password === this.state.confirm) {
			firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
			.then((userData) => {
			})
		}
		document.getElementById('signUp').reset();
		this.showCreateUser(e);
	}
	logIn(e) {
		e.preventDefault();
		firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
		.then((userData) => {
		})
	}
	signOut(e) {
		firebase.auth().signOut();
		window.location.reload();
	}
	addPost(e) {
		e.preventDefault();
		const post = {
			title: this.postTitle.value,
			content: this.postContent.value
		}
		const dbRef = firebase.database().ref();
		dbRef.push(post);
		this.showCreatePost(e)
	}
	removePost(post) {
		const dbRef = firebase.database().ref(post);
		dbRef.remove();
	}
	render() {
		let userStatus = (
				<section className="login__background">
					<div className="login__container">
						<div className="login__container--logo">
							<img src="../../assets/logo_white.png" className="logo_loginPage"alt=""/>
						</div>
						<h4>A simple platform to express your thoughts to the World Wide Web</h4>
						<div className="login__container--modal">
							<form onSubmit={this.logIn} id="logIn">
								<h5>Sign In</h5>
								<input type="email" name="email" onChange={this.handleChange} placeholder="Sign in with email"/>
								<input type="password" name="password" onChange={this.handleChange} placeholder="Enter Password"/>
								<button>Sign In</button>
								<a>Forgot Password?</a>
							</form>
						</div>
					</div>
				</section>
			)
		if(this.state.loggedIn) {
			userStatus = (
					<div>
						<header>
							<nav>
								<div className="wrapper">
									<div className="dashboard__logoContainer">
										<img className="mainLogo" src="../../assets/logo_white.png" alt="Blog Simply Logo in White"/>
									</div>
									<div className="mainNavigation__linksContainer">
										<ul className="mainNavigation__links">
											<li>
												<i onClick={this.signOut} className="fa fa-sign-out" aria-hidden="true"></i>
											</li>
										</ul>
									</div>
								</div>
							</nav>
							<section>
								<div className="wrapper dashboard__title">
									<div className="dashboard__title--left">
										<h3>Your Created Posts</h3>
									</div>
									<div>
										<button onClick={this.showCreatePost} className="dashboard__buttons">Create New Post</button>
										<button onClick={this.showCreateUser} className="dashboard__buttons">Create New User</button>
									</div>
								</div>
							</section>
						</header>
						<div className="dashboard__createUser" ref={ref => this.dashboard__createUser = ref}>
							<form onSubmit={this.signUp} id="signUp">
								<input type="email" name="email" placeholder="Enter Email" onChange={this.handleChange}/>
								<input type="password" name="password" placeholder="Create a Password" onChange={this.handleChange}/>
								<input type="password" name="confirm" placeholder="Confirm Password" onChange={this.handleChange}/>
								<button>Create User</button>
							</form>
							<button onClick={this.showCreateUser}>Cancel</button>
						</div>
						<div className="dashboard__createPost" ref={ref => this.dashboard__createPost = ref}>
							<form onSubmit={this.addPost}>
								<input type="text" name="post-title" placeholder='Blog Title' ref={ref => this.postTitle = ref}/>
								<input type="text" name="post-content" placeholder='Blog Content' ref={ref => this.postContent = ref}/>
								<input type="submit" value="Create Post"/>
							</form>
							<button onClick={this.showCreatePost}>Discard Post</button>
						</div>
						<section>
							<ul className="dashboard__singlePostContainer">
								{this.state.posts.map((item) => {
									return <Post data={item} key={item.key} removePost={this.removePost}/>
								})}
							</ul>
						</section>
					</div>
			)
		}
		return (
			<div>
				{userStatus}
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
			<h1>Welcome to my blog</h1>
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
				<li>
					<h1>{props.data.title}</h1>
					<p>{props.data.content}</p>
					<Link to={`/blog/${props.data.key}`}>View Post</Link>
				</li>
		</div>
	)
}









class SinglePost extends React.Component {
	constructor() {
			super()
			this.state = {
				loggedInSinglePost: false,
				editing: false,
				post: {}
			};
			this.save = this.save.bind(this);
		}
	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
		if(user) {
			this.setState({
				loggedInSinglePost: true
			})
		}
		if(user === null || user) {
			firebase.database().ref().on('value', (res) => {
				const userPostKey = this.props.params.blog_key;
				const userData = res.val();
				this.setState({
					post: userData[userPostKey]
				})
				});
			}
		})
	}
	save(e) {
		e.preventDefault();
		
		const dbRef = firebase.database().ref(this.props.params.blog_key)

		dbRef.update({
			title: this.postTitle.value,
			content: this.postContent.value
		})

		this.setState({
			editing: false
		})
	}
	render() {
		let editingTemp = (
			<div>
				<h1>{this.state.post.title}</h1>
				<p>{this.state.post.content}</p>
			</div>
		)
		if (this.state.loggedInSinglePost) {
			editingTemp = (
				<div>
					<i className="fa fa-pencil" onClick={() => this.setState({editing: true})}></i>
					<h1>{this.state.post.title}</h1>
					<p>{this.state.post.content}</p>
				</div>
			)
		} 
		if (this.state.editing && this.state.loggedInSinglePost) {
			editingTemp = (
				<div>
					<form onSubmit={this.save}>
						<div>
							<input type="text" defaultValue={this.state.post.title} name='title' ref={ref => this.postTitle = ref}/>
						</div>
						<div>
							<input type="text" defaultValue={this.state.post.content} name='content' ref={ref => this.postContent = ref}/>
						</div>
						<input type="submit" value="Done Editing"/>
					</form>
				</div>
			)
		}
		return (
			<div>
				{editingTemp}
			</div>
		)
	}
}


ReactDOM.render(
<Router history={browserHistory}>
    <Route path="/" component={App} />
    <Route path="/blog" component={Blog} />
	<Route path="/blog/:blog_key" component={SinglePost}/>
</Router>, document.getElementById('app'));
