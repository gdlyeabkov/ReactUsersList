import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  state = {
    allUsers: [],
    userID: '',
    userDateRegistration: '',
    userDateLastActivity: '',
    retentionDay: 5,
    resultOfRetentionDay: 0
  }
  constructor(props) {
    super(props);
    this.state = {
      allUsers: [],
      userID: '',
      userDateRegistration: '',
      userDateLastActivity: '',
      retentionDay: 5,
      resultOfRetentionDay: 0
    };
  }

  componentWillMount = async (e) => {
    await fetch(`https://reactonusers.herokuapp.com/getusers`, {
          mode: 'cors',
          method: 'GET'
        }).then(response => response.body).then(rb  => {
          const reader = rb.getReader()
          return new ReadableStream({
            start(controller) {
              function push() {
                reader.read().then( ({done, value}) => {
                  if (done) {
                    console.log('done', done);
                    controller.close();
                    return;
                  }
                  controller.enqueue(value);
                  console.log(done, value);
                  push();
                })
              }
              push();
            }
          });
      }).then(stream => {
          return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
        })
        .then(result => {
          this.setState({
            allUsers: JSON.parse(result)
          })
        });
      }
      calculateRollingRetentionXDay = async () => {
        await fetch(`https://reactonusers.herokuapp.com/calculateretentionxday?retentionday=${this.state.retentionDay}`, {
              mode: 'cors',
              method: 'GET'
            }).then(response => response.body).then(rb  => {
              const reader = rb.getReader()
              return new ReadableStream({
                start(controller) {
                  function push() {
                    reader.read().then( ({done, value}) => {
                      if (done) {
                        console.log('done', done);
                        controller.close();
                        return;
                      }
                      controller.enqueue(value);
                      console.log(done, value);
                      push();
                    })
                  }
                  push();
                }
              });
          }).then(stream => {
              return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
            })
            .then(result => {
              this.setState({
                resultOfRetentionDay: JSON.parse(result).result
              })
            });
      }
      saveUsers = async () => {
        await fetch(`https://reactonusers.herokuapp.com/users/add?userid=${this.state.userID}&userdateregistration=${this.state.userDateRegistration}&userdatelastactivity=${this.state.userDateLastActivity}`, {
              mode: 'cors',
              method: 'GET'
            }).then(response => response.body).then(rb  => {
              const reader = rb.getReader()
              return new ReadableStream({
                start(controller) {
                  function push() {
                    reader.read().then( ({done, value}) => {
                      if (done) {
                        console.log('done', done);
                        controller.close();
                        return;
                      }
                      controller.enqueue(value);
                      console.log(done, value);
                      push();
                    })
                  }
                  push();
                }
              });
          }).then(stream => {
              return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
            })
            .then(result => {
              window.location.reload( )
            });
          }
          setRetentionDay = (e) => {
            this.setState({
              retentionDay: e.target.value
            })
          }

          setUserID = (e) => {
            this.setState({
              userID: e.target.value
            })
          }
          setUserDateRegistration = (e) => {
            this.setState({
              userDateRegistration: e.target.value,
            })
          }
          setUserDateLastActivity = (e) => {
            this.setState({
              userDateLastActivity: e.target.value
            })
          }
      render(){
        return (
          <div>
            <table border="1">
            <tr>
                <td  width="300">
                  UserID
                </td>
                <td  width="300">
                  Date Registration
                </td>
                <td  width="300">
                  Date Last Activity
                </td>
              </tr>
              <tr>
                <td>
                  <input onChange={ this.setUserID } type="text" id="" class="userpassword form-control" placeholder="UserID" required="" />
                </td>
                <td>
                  <input onChange={this.setUserDateRegistration} type="text" id="" class="userpassword form-control" placeholder="UserDateRegistration" required="" />
                </td>
                <td>
                  <input onChange={this.setUserDateLastActivity} type="text" id="" class="form-control" placeholder="UserDateLastActivity" required="" /> 
                </td>
              </tr>
            </table>
            <div>
              {
                this.state.allUsers.length <= 0
                ?
                  <p>Нет пользователей</p>
                :
                  this.state.allUsers.map((user) => {
                    return (
                      <table border="1" key={user.userid}>
                        <tr>
                          <td  width="300">
                          { user.userid } 
                          </td>
                          <td  width="300">
                          { user.dateregistration  } 
                          </td>
                          <td  width="300"  >
                            { user.datelastactivity } 
                          </td>
                        </tr>
                      </table>
                    )
                  })
              }      
            </div>
            <button class="btn btn-lg btn-primary btn-block" onClick={this.saveUsers}>Save</button>
            <br/> 
            <label class="sr-only">Входные данные: </label>
            <input onChange={ this.setRetentionDay } value={ this.state.retentionDay } type="text" id="" class="userpassword form-control" placeholder="retentionDay" required="" />
            <button class="btn btn-lg btn-primary btn-block" onClick={this.calculateRollingRetentionXDay}>Calculate</button>
            <p>результат: { this.state.resultOfRetentionDay }</p>
          </div>
        );
      }
  
}

export default App;
