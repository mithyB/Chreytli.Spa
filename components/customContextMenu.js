customContextMenu = (function() {
    var $this = {};
    var $check;
    var $action;
    var $click;

    $this.onOpen = function(check, action, click) {
        $check = check;
        $action = action;
        $click = click;
    };

    function onContextMenu(e) {
        $('#customContextMenu').remove();
        if ($check(e)) {
            var items = $action(e);

            var div = $('<DIV/>');
            div.css({
                'position': 'absolute',
                'top': e.pageY,
                'left': e.pageX,
                'background-color': 'white',
                'z-index': 9999,
                'border': '1px solid #ddd',
                'border-radius': '5px',
                'width': '150px',
                'padding-top': '10px',
                'padding-bottom': '10px',
                'box-shadow': '2px 2px 10px #555'
            });
            div.attr('id', 'customContextMenu');
            div.addClass('list-group');

            $.each(items, function(i, x) {
                var li = $('<BUTTON/>')
                    .addClass('list-group-item')
                    .css({
                        'border': '0 solid transparent',
                        'padding': '10px',
                        'background': 'white'
                    })
                    .html(x.html)
                    .on('click', function() { $click(x.key); })
                    .appendTo(div);
            });

            document.body.appendChild(div[0]);

            return true;
        }

        return false;
    }

    if (document.addEventListener) {
        document.addEventListener('contextmenu', function (e) {
            if (onContextMenu(e)) {
                e.preventDefault();
            }
        }, false);
    } else {
        document.attachEvent('oncontextmenu', function () {
            if (onContextMenu(e)) {
                window.event.returnValue = false;
            }
        });
    }

    $(document).on('click', function() {
        $('#customContextMenu').remove();
    });

    return $this;
})();