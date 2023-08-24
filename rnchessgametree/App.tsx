import { Provider } from 'react-redux';
import { store } from './Redux/store';
import RootNav from './Navigation/rootNav';


export default function App() {
  return (
    <Provider store={store}>
      <RootNav/>
    </Provider>
  );
};
