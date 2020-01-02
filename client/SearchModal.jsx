/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import Axios from 'axios';
import _ from 'lodash';

import SuggestedList from './components/SuggestedList';
import HistoryList from './components/HistoryList';
import PopularSearches from './components/PopularSearches';
import CategoryLinks from './components/CategoryLinks';
import AutoFillList from './components/AutoFillList';
import linksList from './assets/linksList';
import PrefixTree from './assets/prefixTree';
import dictionary from './assets/dictionary';
import HeaderLinks from './components/HeaderLinks';
import NavBar from './components/NavBar';
import FadingPlaceholder from './components/FadingPlaceholder';
import Breadcrumb from './components/Breadcrumb';

// const url = 'http://teammeatballs-searchbar.us-east-2.elasticbeanstalk.com/';

// URL FOR WORKING LOCALLY
const url = 'http://localhost:3025';

const wordTree = new PrefixTree(...dictionary);

export default class SearchModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItem: {
        id: 3,
        real_name: 'HAVSTEN',
        category: 'chair',
      },
      cartCount: 0,
      showModal: false,
      isSelected: false,
      input: '',
      products: [],
      history: [{
        id: 0,
        searchItem: 'lamps',
      }],
      suggestedItems: [],
      autoFillOptions: [],
      currentPlaceholder: 0,
      popularSearches: ['desk', 'dresser', 'mirror', 'tv stand', 'shelves', 'kallax'],
    };

    this.onTyping = this.onTyping.bind(this);
    this.getAllProducts = this.getAllProducts.bind(this);
    this.getHistory = this.getHistory.bind(this);
    this.clearHistory = this.clearHistory.bind(this);
    this.addHistoryItem = this.addHistoryItem.bind(this);
    this.selectModal = this.selectModal.bind(this);
    this.unselectModal = this.unselectModal.bind(this);
    this.selectSearchBar = this.selectSearchBar.bind(this);
    this.unselectSearchBar = this.unselectSearchBar.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.searchForSuggestedItems = this.searchForSuggestedItems.bind(this);
    this.selectSearchedItem = this.selectSearchedItem.bind(this);
    this.updateCart = this.updateCart.bind(this);
    this.findReceivedItem = this.findReceivedItem.bind(this);
    this.rotatePlaceholder = this.rotatePlaceholder.bind(this);
    this.goToMeatballs = this.goToMeatballs.bind(this);
  }

  componentDidMount() {
    this.getAllProducts();
    this.getHistory();
    this.rotatePlaceholder();

    window.addEventListener('cartUpdated', (event) => {
      this.updateCart(event.detail.cartCount);
    });

    window.addEventListener('productChanged', (event) => {
      this.findReceivedItem(Number(event.detail.productId));
    });
  }

  onTyping(event) {
    const input = event.target.value;

    const autocompletes = wordTree.getCompleteRemaindersFrom(input);
    autocompletes.sort();
    this.setState({
      input,
      autoFillOptions: autocompletes,
    });
    this.searchForSuggestedItems(input);
  }

  getAllProducts() {
    Axios.get('/products', {
      baseURL: url,
    })
      .then((data) => {
        this.setState({
          products: data.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getHistory() {
    Axios.get('/history', {
      baseURL: url,
    })
      .then((data) => {
        this.setState({
          history: data.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  selectModal() {
    this.setState({
      showModal: true,
      isSelected: true,
    });
  }

  unselectModal() {
    this.setState({
      showModal: false,
    });
  }

  selectSearchBar() {
    this.setState({
      isSelected: true,
    });
  }

  unselectSearchBar() {
    this.setState({
      isSelected: false,
    });
  }

  clearInput(event) {
    event.preventDefault();
    this.setState({
      input: '',
    });
  }

  addHistoryItem(searchItem) {
    Axios
      .post('/history', {
        searchItem,
      }, {
        baseURL: url,
      })
      .then((data) => {
        const { history } = this.state;
        history.push({
          id: data.insertId,
          searchItem,
        });
        this.setState({
          history,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  clearHistory() {
    Axios.delete('/history', {
      baseURL: url,
    })
      .then((data) => {
        if (data.data.affectedRows > 0) {
          this.setState({
            history: [],
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  searchForSuggestedItems(rawInput) {
    const input = rawInput.toLowerCase();
    const { products } = this.state;
    let suggestedItems = _.filter(products, (item) => item.real_name.includes(input)
      || item.description.toLowerCase().includes(input)
      || item.category.includes(input));
    suggestedItems = suggestedItems.slice(0, 6);
    this.setState({
      suggestedItems,
    });
  }

  selectSearchedItem(product) {
    window.dispatchEvent(new CustomEvent('productChanged', {
      bubbles: true,
      detail: {
        productId: product.id,
      },
    }));

    this.setState({
      isSelected: false,
      showModal: false,
      input: '',
    });
  }

  updateCart(cartCount) {
    this.setState({
      cartCount,
    });
  }

  findReceivedItem(id) {
    const { products } = this.state;

    for (let i = 0; i < products.length; i += 1) {
      if (products[i].id === id) {
        this.setState({
          currentItem: products[i],
        });
        return;
      }
    }
  }

  rotatePlaceholder() {
    let { currentPlaceholder } = this.state;

    switch (currentPlaceholder) {
      case 1:
        currentPlaceholder += 1;
        break;
      case 2:
        currentPlaceholder += 1;
        break;
      case 3:
        currentPlaceholder = 1;
        break;
      default:
        currentPlaceholder = 1;
        break;
    }

    this.setState({
      currentPlaceholder,
    });

    setTimeout(() => {
      this.rotatePlaceholder();
    }, 3000);
  }

  goToMeatballs() {
    const meatballs = {
      id: 40,
      real_name: 'ALLEMANSRÄTTEN',
      category: 'meatballs',
    };

    window.dispatchEvent(new CustomEvent('productChanged', {
      bubbles: true,
      detail: {
        productId: 40,
      },
    }));

    this.setState({
      currentItem: meatballs,
      isSelected: false,
      showModal: false,
      input: '',
    });
  }

  render() {
    const {
      popularSearches, history, input, suggestedItems, currentPlaceholder,
      showModal, isSelected, autoFillOptions, cartCount, currentItem,
    } = this.state;

    const selected = isSelected ? 't_selectedInput' : 't_unselectedInput';
    const isFirstChild = history.length === 0;
    const inputEmpty = input === '';

    return showModal ? (
      <div className="t_all-wrapper">
        <header className="t_header">
          <HeaderLinks />
          <NavBar
            cartCount={cartCount}
            unselectSearchBar={this.unselectSearchBar}
            unselectModal={this.unselectModal}
          />
        </header>
        <div
          className="t_search-modal-overlay"
          onClick={(event) => {
            event.stopPropagation();
            this.unselectModal();
          }}
        />
        <div className="t_search-field-wrapper">
          <div className="t_search-field-active">
            <div
              className="t_search-box-container"
              onClick={(event) => {
                event.stopPropagation();
                this.unselectSearchBar();
              }}
            >
              <form className="t_search-form">
                <div className="t_search-field">
                  <input
                    type="text"
                    value={input}
                    autoFocus
                    className={`${selected} t_input-bar`}
                    onClick={(event) => {
                      event.stopPropagation();
                      this.selectSearchBar();
                    }}
                    onChange={this.onTyping}
                    onKeyPress={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        this.addHistoryItem(input);
                      }
                    }}
                  />
                  {inputEmpty ? (
                    <FadingPlaceholder
                      currentActive={currentPlaceholder}
                      onClick={this.selectModal}
                    />
                  ) : null}
                  {input !== '' ? (
                    <span className="t_search-buttons-wrapper">
                      <button
                        type="button"
                        className="t_search-button t_search-button-reset"
                        onClick={this.clearInput}
                      />
                      <button
                        type="button"
                        className="t_search-button t_search-button-search"
                        onClick={() => {
                          this.addHistoryItem(input);
                        }}
                      />
                    </span>
                  ) : null}
                </div>
              </form>
              <div className="t_under-search-container">
                <div className="t_search-bar-area">
                  {inputEmpty && history.length > 0
                    ? (<HistoryList history={history} clearHistory={this.clearHistory} />) : null }
                  {inputEmpty
                    ? (
                      <PopularSearches
                        popularSearches={popularSearches}
                        isFirstChild={isFirstChild}
                      />
                    ) : null}
                  {!inputEmpty
                    ? (
                      <AutoFillList
                        autoFillOptions={autoFillOptions}
                        currentInput={input}
                        goToMeatballs={this.goToMeatballs}
                      />
                    ) : null }
                  {!inputEmpty ? <CategoryLinks linksList={linksList} /> : null }
                  {!inputEmpty && suggestedItems.length > 0
                    ? (
                      <SuggestedList
                        suggestedItems={suggestedItems}
                        selectSearchedItem={this.selectSearchedItem}
                      />
                    ) : null }
                </div>
              </div>
            </div>
          </div>
        </div>
        <Breadcrumb currentItem={currentItem} />
      </div>
    ) : (
      <div className="t_all-wrapper">
        <header className="t_header">
          <HeaderLinks />
          <NavBar
            cartCount={cartCount}
            unselectSearchBar={this.unselectSearchBar}
            unselectModal={this.unselectModal}
          />
        </header>
        <div className="t_search-field-wrapper">
          <div className="t_search-field t_search-field-inactive">
            <input
              type="text"
              value={input}
              className="t_unselectedInput t_input-bar"
              onClick={this.selectModal}
              readOnly
            />
            {inputEmpty ? (
              <FadingPlaceholder
                currentActive={currentPlaceholder}
                onClick={this.selectModal}
              />
            ) : null}
          </div>
        </div>
        <Breadcrumb currentItem={currentItem} />
      </div>
    );
  }
}
