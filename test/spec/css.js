describe('CSS Handling', function() {
	var el;
	var $el;

	beforeEach(function() {
		el = document.createElement('div');
		$el = $(el);
	});

	it('should handle a key/value pair', function() {
		// Set the background color of the div
		$el.css('background', 'green');

		// Test
		expect(el.style.background).toEqual('green');
	});

	it('should handle a JSON object', function() {
		// Give the element some CSS
		$el.css({
			'background': 'green',
			'color': 'white'
		});

		// Test
		expect(el.style.background).toEqual('green');
		expect(el.style.color).toEqual('white');
	});

	describe('Camel-casing strings', function() {
		it('should camel case key/value pairs', function() {
			// Give the element some CSS
			$el.css('text-align', 'center');

			// Test
			expect(el.style.textAlign).toEqual('center');
		});

		it('should not camel-case already camel-cased strings', function() {
			// Give the element some CSS
			$el.css('textAlign', 'center');

			// Test
			expect(el.style.textAlign).toEqual('center');
		});
	});
});