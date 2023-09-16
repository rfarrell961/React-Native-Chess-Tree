import { Provider } from 'react-redux';
import { store } from './Redux/Store';
import RootNav from './Navigation/RootNav';


export default function App() {

  return (
    <Provider store={store}>
      <RootNav/>
    </Provider>
  );
};
