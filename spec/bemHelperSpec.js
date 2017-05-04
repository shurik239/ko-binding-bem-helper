define(['knockout', 'jquery', 'bemHelper'], function (knockout, $) {
  describe('bindings/bemHelper', function () {
    var $container;

    function createTestContainer(div) {
      $container = $(div);

      knockout.applyBindings({}, $container[0]);
    }

    it('should throw exceptions if mainClass is not set or elemnt has no class attr', function () {
      expect(function () {
        createTestContainer('<div data-bind="bemHelper">');
      }).toThrow();
    });

    it('should not throw exceptions if mainClass or attr class is set', function () {
      expect(function () {
        createTestContainer('<div class="Test" data-bind="bemHelper">');
      }).not.toThrow();

      expect(function () {
        createTestContainer('<div data-bind="bemHelper: {name: \'Test\'}">');
      }).not.toThrow();
    });

    it('should set mainClass as class attr', function () {
      createTestContainer('<div data-bind="bemHelper: {name: \'Test\'}">');
      expect($container).toHaveClass('Test');
    });

    it('should add bem modifier, if param modifier is String', function () {
      createTestContainer('<div class="Test" data-bind="bemHelper: {modifier: \'Mod\'}">');
      expect($container).toHaveClass('Test');
      expect($container).toHaveClass('Test--Mod');
    });

    it('should add bem element, if param elemnt is set', function () {
      createTestContainer('<div class="Test" data-bind="bemHelper: {modifier: \'Mod\', element: \'Element\'}">');
      expect($container).toHaveClass('Test__Element');
      expect($container).toHaveClass('Test__Element--Mod');
    });

    it('should add bem modifiers, if param modifier is Array', function () {
      createTestContainer('<div class="Test" data-bind="bemHelper: {modifier: [\'Mod1\', \'Mod2\']}">');
      expect($container).toHaveClass('Test');
      expect($container).toHaveClass('Test--Mod1');
      expect($container).toHaveClass('Test--Mod2');
    });
  });
});
