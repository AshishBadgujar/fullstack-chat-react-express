import React, { useEffect, useRef } from 'react'

export default function Navbar({ isLogin, setIsLogin, users, room }) {
    const sidenavRef = useRef(null)
    useEffect(() => {
        const M = window.M;
        M.Sidenav.init(sidenavRef.current);
    })

    const leaveRoom = async () => {
        const leaveRoom = window.confirm('Are you sure you want to leave the chatroom?');
        if (leaveRoom) {
            setIsLogin(false)
            await sessionStorage.clear('username')
            await sessionStorage.clear('room')
        } else {
        }
    }
    return (
        <div>
            {isLogin ?
                <nav>
                    <div className="nav-wrapper container">
                        <a href="#" data-target="mobile-demo" className="sidenav-trigger show-on-large"><i
                            className="material-icons">menu</i></a>
                        <a className="brand-logo">{room}</a>
                    </div>
                    <ul className="sidenav" id="mobile-demo" ref={sidenavRef}>
                        <li className="z-depth-2">
                            <a>
                                <i className="material-icons">question_answer</i>
                                <h4 id="room-name">{room}</h4>
                            </a>
                        </li>
                        <li>
                            <a>
                                <h5>Users</h5>
                            </a>
                        </li>
                        <ul className="userList">
                            {users.map(user => (
                                <li key={user.id}><a>{user.username}</a></li>
                            ))}
                        </ul>
                        <li><a href='/' id="leave-btn" onClick={() => leaveRoom()}>Leave room</a></li>
                    </ul>
                </nav>
                :
                <nav>
                    <div className="nav-wrapper container">
                        <a className="brand-logo"><i className="material-icons">question_answer</i>chat app</a>
                    </div>
                </nav>
            }
        </div>
    )
}
