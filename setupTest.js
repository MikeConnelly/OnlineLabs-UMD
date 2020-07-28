import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'babel-polyfill';

module.exports = async () => {
  configure({ adapter: new Adapter() });
}
