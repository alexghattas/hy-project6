import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Link } from 'react-router';
import Blog from './components/blog.js';
import SinglePost from './components/singlepost.js';
import SweetAlert from 'sweetalert-react';

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
		<li>
			<ul className="dashboard__singlePost">
				<li>
					<h2>{props.data.title}</h2>
				</li>
				<li>
					<p>{props.data.author}</p>
				</li>
				<li>
					<p>{props.data.date}</p>
				</li>
				<li>
					<button onClick={() => props.removePost(props.data.key)}>Delete</button>
					<Link className="dashboard__viewEdit--button" to={`/blog/${props.data.key}`}>View/Edit</Link>
				</li>
			</ul>
		</li>
	)
}


class App extends React.Component {
	constructor() {
		super();
		this.state = {
			loggedIn: false,
			photo: '',
			show: '',
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
		this.uploadPhoto = this.uploadPhoto.bind(this);
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
					posts: dataArray,
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
		.catch((error) => {
			console.log('error!!', error.code)
			let alertMessage = ''
			if(error.code === 'auth/user-not-found') {
				this.setState ({
					show: true
				})
			}
		})
		.then((userData) => {
		})
	}
	signOut(e) {
		firebase.auth().signOut();
		this.setState ({
			loggedIn: false
		})
	}
	addPost(e) {
		e.preventDefault();
		const post = {
			title: this.postTitle.value,
			content: this.postContent.value,
			author: this.postAuthor.value,
			date: this.postDate.value,
			photo: this.state.photo

		}
		const dbRef = firebase.database().ref();
		dbRef.push(post);
		this.showCreatePost(e)
		this.state.photo= ''
	}
	uploadPhoto(e) {
		console.log('photo upload begin')
		let file = e.target.files[0];
		const storageRef = firebase.storage().ref('photos/' + file.name);
		const task = storageRef.put(file).then(() => {
			const urlObject = storageRef.getDownloadURL().then((data) => {
				console.log('photo upload DONE')
				this.setState ({
					photo: data,
					photoStatus: false
				})
			})
		});

	}
	removePost(post) {
		const dbRef = firebase.database().ref(post);
		dbRef.remove();
	}
	render() {
		let sweetAlertPop = (
				<SweetAlert
				        show={this.state.show}
				        title="Oops!"
				        text="Sorry! That email and password do not seem to match."
				        onConfirm={() => this.setState({ show: false })}
				 />
			)
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
												<Link to="/blog"className="dashboard__buttonNav">Go To Blog</Link>
											</li>
											<li>
												<button onClick={this.signOut} className="dashboard__buttonNav">Sign Out</button>
											</li>
										</ul>
									</div>
								</div>
							</nav>
							<section className="dashboard__titleBackground">
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
							<div className="dashboard__createUser--container">
								<h2>Create a New User</h2>
								<form onSubmit={this.signUp} id="signUp">
									<input className="dashboard__createUserInputs" type="email" name="email" placeholder="Enter Email" onChange={this.handleChange}/>
									<input className="dashboard__createUserInputs" type="password" name="password" placeholder="Create a Password" onChange={this.handleChange}/>
									<input className="dashboard__createUserInputs" type="password" name="confirm" placeholder="Confirm Password" onChange={this.handleChange}/>
									<button className="dashboard__createUser--button">Create User</button>
								</form>
								<button className="dashboard__createUser--discardButton" onClick={this.showCreateUser}>Cancel</button>
							</div>
						</div>


						<div className="dashboard__createPost" ref={ref => this.dashboard__createPost = ref}>
							<div className="dashboard__createPost--container">
								<h2>Create a New Post</h2>
								<form className="dashboard__createUserForm" onSubmit={this.addPost} ref={ref => this.dashboard__createUserForm = ref}>
									<div className="dashboard__createPostInputs--firstLine">
										<input type="text" placeholder="Type in Author"name="post-author" ref={ref => this.postAuthor = ref}/>
										<input className="dashboard__createPost--dates" type="date" name="post-date" ref={ref => this.postDate = ref}/>
										<input type="file" accept="image/*" onChange={this.uploadPhoto}/>
									</div>
									<input className="dashboard__createPostInputs--title" type="text" name="post-title" placeholder='Blog Title' ref={ref => this.postTitle = ref}/>
									<textarea rows="7" className="dashboard__createPostInputs--content" type="text" name="post-content" placeholder='Blog Content' ref={ref => this.postContent = ref}/>
									<input className="dashboard__createPost--button" type="submit" value="Create Post"/>
								</form>
								<button className="dashboard__createPost--discardButton" onClick={this.showCreatePost}>Discard Post</button>
							</div>
						</div>


						<section>
							<ul className="dashboard__singlePost--listTitles wrapper__dashboard--list">
								<li>Post Title</li>
								<li>Author</li>
								<li>Date</li>
								<li>Actions</li>
							</ul>
							<ul className="dashboard__singlePost--list wrapper__dashboard--list">
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
				{sweetAlertPop}
				{userStatus}
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
