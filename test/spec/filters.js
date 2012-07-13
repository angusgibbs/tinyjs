describe('Filters', function() {
	var elOne;
	var $elOne;
	var elTwo;
	var $elTwo;
	var tinyObj;
	var wrapper;

	beforeEach(function() {
		// Create and append the elements
		wrapper = document.createElement('div');
		elOne = document.createElement('div');
		elTwo = document.createElement('div');

		wrapper.id = 'wrapper';

		wrapper.appendChild(elOne);
		wrapper.appendChild(elTwo);
		document.body.appendChild(wrapper);

		// Show them all
		wrapper.style.display = 'block';
		elOne.style.display = 'block';
		elTwo.style.display = 'block';
		elOne.innerHTML = 'One';
		elTwo.innerHTML = 'Two';

		// Create tiny objects
		$elOne = $(elOne);
		$elTwo = $(elTwo);
	});

	afterEach(function() {
		// Remove the elements from the DOM
		wrapper.removeChild(elOne);
		wrapper.removeChild(elTwo);
		document.body.removeChild(wrapper);
	});

	it('Should filter out elements that are hidden', function() {
		// Hide the first element
		elOne.style.display = 'none';

		// Get the elements
		tinyObj = $('#wrapper div').is('visible');

		// Test
		expect(tinyObj[0]).toEqual(elTwo);
	});

	it('Should filter out elements that are visible', function() {
		// Hide the first element
		elOne.style.display = 'none';

		// Get the elements
		tinyObj = $('#wrapper div').is('hidden');

		// Test
		expect(tinyObj[0]).toEqual(elOne);
	});

	it('Should filter out elements that are empty', function() {
		// Get the elements
		tinyObj = $('#wrapper').is('empty');

		// Test
		expect('0' in tinyObj).toEqual(false);
	});
});