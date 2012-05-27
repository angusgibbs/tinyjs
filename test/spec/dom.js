describe('DOM manipulation', function() {
	var el, $el, div, $div, ul, $ul;

	beforeEach(function() {
		// Construct the DOM
		el = document.createElement('div');
		$el = $(el);
	});

	describe('Appending and prepending', function() {
		it('Should append to a non-empty element', function() {
			// Construct the DOM
			el.appendChild(document.createElement('div'));
			$el.append('span');

			// Test
			expect(el.children[1].nodeName.toLowerCase()).toEqual('span');
		});

		it('Should append to an empty element', function() {
			// Construct the DOM
			$el.append('span');

			// Test
			expect(el.children.length).toEqual(1);
			expect(el.children[0].nodeName.toLowerCase()).toEqual('span');
		});

		it('Should prepend to a non-empty element', function() {
			// Construct the DOM
			el.appendChild(document.createElement('div'));
			$el.prepend('span');

			// Test
			expect(el.children[1].nodeName.toLowerCase()).toEqual('div');
		});

		it('Should prepend to a non-empty element', function() {
			// Construct the DOM
			$el.prepend('span');

			// Test
			expect(el.children.length).toEqual(1);
			expect(el.children[0].nodeName.toLowerCase()).toEqual('span');
		});

		describe('Appending', function() {
			it('Should assign attributes correctly', function() {
				// Create an element with some attributes
				$el.append('div', '', {
					'data-hello': 'world',
					'data-foo': 'bar'
				});

				// Test
				expect(el.children[0].getAttribute('data-hello')).toEqual('world');
				expect(el.children[0].getAttribute('data-foo')).toEqual('bar');
			});

			it('Should assign the innerHTML of the element', function() {
				// Create the element
				$el.append('div', 'Hello, world!');

				// Test
				expect(el.children[0].innerHTML).toEqual('Hello, world!');
			});
		});

		describe('Prepending', function() {
			it('Should assign attributes correctly', function() {
				// Create an element with some attributes
				$el.append('div', '', {
					'data-hello': 'world',
					'data-foo': 'bar'
				});

				// Test
				expect(el.children[0].getAttribute('data-hello')).toEqual('world');
				expect(el.children[0].getAttribute('data-foo')).toEqual('bar');
			});

			it('Should assign the innerHTML of the element', function() {
				// Create the element
				$el.append('div', 'Hello, world!');

				// Test
				expect(el.children[0].innerHTML).toEqual('Hello, world!');
			});
		});
	});

	describe('Traversing', function() {
		var div;
		var ul;
		var firstLi;
		var secondLi;
		var thirdLi;
		var anchor;
		var tinyObj;
		var p;

		beforeEach(function() {
			// Construct a DOM to work with
			div = document.createElement('div');
			ul = document.createElement('ul');
			firstLi = document.createElement('li');
			secondLi = document.createElement('li');
			thirdLi = document.createElement('li');
			anchor = document.createElement('a');
			p = document.createElement('p');

			div.id = 'div';
			ul.className = 'ul';
			ul.id = 'ul';
			p.id = 'p';
			anchor.className = 'anchor';
			secondLi.className = 'secondLi';

			el.appendChild(div);
			el.appendChild(ul);
			ul.appendChild(firstLi);
			ul.appendChild(secondLi);
			ul.appendChild(thirdLi);
			secondLi.appendChild(anchor);
			el.appendChild(p);
		});

		describe('next()', function() {
			describe('Getting next element where it exists', function() {
				it('Should work when there is 1 element', function() {
					// Get the element
					tinyObj = $(div).next();

					// Test
					expect(tinyObj[0].nodeName.toLowerCase()).toEqual('ul');
				});

				it('Should work when there are more than 1 elements', function() {
					// Get the element
					tinyObj = $([firstLi, secondLi, thirdLi]).next();

					// Test
					expect(tinyObj.length).toEqual(2);
					expect(tinyObj[0]).toEqual(secondLi);
				});

				describe('Using basic selectors', function() {
					it('Should work with tag names', function() {
						// Get the element
						tinyObj = $(div).next('p');

						// Test
						expect(tinyObj[0]).toEqual(p);
					});

					it('Should work with class names', function() {
						// Get the element
						tinyObj = $(firstLi).next('.secondLi');

						// Test
						expect(tinyObj[0]).toEqual(secondLi);
					});

					it('Should work with ids', function() {
						// Get the element
						tinyObj = $(div).next('#p');

						// Test
						expect(tinyObj[0]).toEqual(p);
					});
				});
			});

			describe('Getting next element where it does not exist', function() {
				it('Should not break when the next element does not exist', function() {
					tinyObj = $(p).next();

					expect('0' in tinyObj).toEqual(false);
				});
			});
		});

		describe('prev()', function() {
			describe('Getting previous element where it exists', function() {
				it('Should work when there is 1 element', function() {
					// Get the element
					tinyObj = $(ul).prev();

					// Test
					expect(tinyObj[0].nodeName.toLowerCase()).toEqual('div');
				});

				it('Should work when there are more than 1 elements', function() {
					// Get the element
					tinyObj = $([firstLi, secondLi, thirdLi]).prev();

					// Test
					expect(tinyObj.length).toEqual(2);
					expect(tinyObj[0]).toEqual(firstLi);
				});

				describe('Using basic selectors', function() {
					it('Should work with tag names', function() {
						// Get the element
						tinyObj = $(p).prev('div');

						// Test
						expect(tinyObj[0]).toEqual(div);
					});

					it('Should work with class names', function() {
						// Get the element
						tinyObj = $(thirdLi).prev('.secondLi');

						// Test
						expect(tinyObj[0]).toEqual(secondLi);
					});

					it('Should work with ids', function() {
						// Get the element
						tinyObj = $(p).prev('#div');

						// Test
						expect(tinyObj[0]).toEqual(div);
					});
				});
			});

			describe('Getting previous element where it does not exist', function() {
				it('Should not break when the next element does not exist', function() {
					tinyObj = $(div).prev();

					expect('0' in tinyObj).toEqual(false);
				});
			});
		});

		describe('parent()', function() {
			describe('Getting parent element where it exists', function() {
				it('Should work when there is 1 element', function() {
					// Get the element
					tinyObj = $(ul).parent();

					// Test
					expect(tinyObj[0]).toEqual(el);
				});

				it('Should work when there are more than 1 elements', function() {
					// Get the element
					tinyObj = $([firstLi, secondLi, thirdLi]).parent();

					// Test
					expect(tinyObj[0]).toEqual(ul);
				});

				it('Should merge common parents', function() {
					// Get the element
					tinyObj = $([firstLi, secondLi, thirdLi]).parent();

					// Test
					expect(tinyObj.length).toEqual(1);
				});

				describe('Using basic selectors', function() {
					it('Should work with tag names', function() {
						// Get the element
						tinyObj = $(anchor).parent('li');
						// Test
						expect(tinyObj[0]).toEqual(secondLi);
					});

					it('Should work with class names', function() {
						// Get the element
						tinyObj = $(anchor).parent('.secondLi');

						// Test
						expect(tinyObj[0]).toEqual(secondLi);
					});

					it('Should work with ids', function() {
						// Get the element
						tinyObj = $(anchor).parent('#ul');

						// Test
						expect(tinyObj[0]).toEqual(ul);
					});
				});
			});

			describe('Getting parent element where it does not exist', function() {
				it('Should not break when the parent element does not exist', function() {
					tinyObj = $(el).parent();

					expect('0' in tinyObj).toEqual(false);
				});
			});
		});
	});
});