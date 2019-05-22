import { shallow } from 'enzyme';
import ItemComponent from '../components/Item';

const fakeItem = {
  id: 'ABC123',
  title: 'A Cool item',
  price: 5000,
  description: 'This is really cool!',
  image: 'dog.jpg',
  largeImage: 'largeDog.jpg',
};

describe('<Item/>', () => {
  it('renders the image properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const img = wrapper.find('img');

    expect(img.props().src).toBe(fakeItem.image);
    expect(img.props().alt).toBe(fakeItem.title);
  });

  it('renders the pricetag and title properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const PriceTag = wrapper.find('PriceTag');

    // console.log(wrapper.debug());

    // these tests are equivalent. dive() shallow renders the component one level deeper
    expect(PriceTag.dive().text()).toBe('$50');
    expect(PriceTag.children().text()).toBe('$50');

    expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  });

  it('renders the buttons properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const buttonList = wrapper.find('.buttonList');

    expect(buttonList.children()).toHaveLength(3);

    // these should all be functionally equivalent
    expect(buttonList.find('Link')).toHaveLength(1);
    expect(buttonList.find('Link').exists()).toBe(true);
    expect(buttonList.find('Link')).toBeTruthy();

    expect(buttonList.find('AddToCart')).toBeTruthy();
    expect(buttonList.find('DeleteItem')).toBeTruthy();
  });
});
