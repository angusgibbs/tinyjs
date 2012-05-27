describe('Classes', function() {
	var el;
	var $el;
	var elTwo;
	var $elTwo;
	var tinyObj;

	beforeEach(function() {
		el = document.createElement('div');
		$el = $(el);
		elTwo = document.createElement('div');
		$elTwo = $(elTwo);
	});

	describe('Adding classes', function() {
		it('Should add a class', function() {
			// Add the class
			$el.addClass('hello');

			// Test
			expect(el.className).toMatch(/(^|\s)hello($|\s)/g);
		});

		it('Should only add a class once', function() {
			// Add the class
			el.className = 'hello';
			$el.addClass('hello');

			// Test
			expect(el.className).toEqual('hello');
		});
	});

	describe('Removing classes', function() {
		it('Should remove a class', function() {
			// Add the class
			el.className = 'hello';

			// Remove it
			$el.removeClass('hello');

			// Test
			expect(el.className).toMatch(/\s*/);
		});

		it('Should work when the class being removed doesn\'t exist', function() {
			// Add a class
			el.className = 'hello';

			// Remove a different class
			$el.removeClass('world');

			// Test
			expect(el.className).toEqual('hello');
		});
	});

	describe('Testing for classes', function() {
		it('Should return true if the class exists', function() {
			// Add the class
			el.className = 'hello';

			// Test
			expect($el.hasClass('hello')).toEqual(true);
		});

		it('Should return false if the class does not exist', function() {
			// Test
			expect($el.hasClass('hello')).toEqual(false);
		});

		it('Should only return true if every element has the class', function() {
			// Make the object
			el.className = 'hello';
			tinyObj = $([el, elTwo]);

			// Test
			expect(tinyObj.hasClass('hello')).toEqual(false);
		});
	});
});