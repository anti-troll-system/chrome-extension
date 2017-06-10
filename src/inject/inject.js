chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		var $ = jQuery,
			count = 0;

		setInterval( findNewComments, 2000 );
		
		function findNewComments() {			
		
			$('.UFIComment:not([patrolled])').each(function(){
				
				var $this = $(this).attr('patrolled', 'true');

				var $icon = createPatrollIcon();
				$this.find('.lfloat').append($icon);

				$icon.data('user', $this.find('.UFICommentActorName').text() );
				
				generateRandomData( $icon );
				
				// on hover show info popup
				$icon.bind('mouseover', showPopup);
				$icon.bind('mouseout', hidePopup);
				
				// show icon (random) delayed and animated
				var randomTimeout = parseInt(Math.random()*2000 + 10);
				
				setTimeout( function(){ 
					$icon.removeClass('inicializing').addClass('bounceIn'); 
					
					var wait = 200, //ms
						delay = 200; //ms
					setTimeout( function(){ $icon.removeClass('hold-1'); }, wait+delay*1);
					setTimeout( function(){ $icon.removeClass('hold-2'); }, wait+delay*2);
					setTimeout( function(){ $icon.removeClass('hold-3'); }, wait+delay*3);
					setTimeout( function(){ $icon.removeClass('hold-4'); }, wait+delay*4);
				}, randomTimeout);
				
				
				console.log(++count, $icon);
			});
		}
		
		
		function generateRandomData( $icon ) {
			
			for (var i=1; i<=4; i++) {
				var value = Math.round( Math.random()*(100-(i-1)*20) );
				$icon.find('.level-'+i+' span').css('width', value+'%');
				$icon.data('value-'+i, value );
			}
			
			var randomType = Math.random();
			if (randomType>0.8) {
				$icon.addClass('unknown');
			}
			else if (randomType>0.4) {
				$icon.addClass('blank');
			}
		}
		
		
		var patrollIconTemplate;
		
		function createPatrollIcon() {
			if (!patrollIconTemplate) {
				patrollIconTemplate = $(
					'<div class="patroll-icon inicializing hold-1 hold-2 hold-3 hold-4">'+
						'<div class="level-1"><span></span></div>'+
						'<div class="level-2"><span></span></div>'+
						'<div class="level-3"><span></span></div>'+
						'<div class="level-4"><span></span></div>'+
					 '</div>')[0];
			}
			return $(patrollIconTemplate.cloneNode(true));
		}
		
		
		var $popup,
			isShowingPopup = false,
			lastUserInPopup;
		
		function showPopup(e) {
			isShowingPopup = true;
			var $target = $(e.target).closest('.patroll-icon'),
				userName = $target.data('user');
			
			if ($popup && userName && userName!=lastUserInPopup) {
				$popup.remove();
				$popup = null;
			}
			
			if (!$popup) {
				lastUserInPopup = userName;
				
				$popup = $(
						'<div class="patroll-popup hidden">'+
							'<div class="pin"></div>'+
							'<div class="logo"></div>'+
						'</div>');
						
						
				$popup.bind('mouseover', showPopup);
				$popup.bind('mouseout', hidePopup);
				// i dont know how to address image from css for extension
				$popup.find('.pin').css('background-image', 'url('+chrome.extension.getURL('src/inject/right-pin.png')+')');
				$popup.find('.logo').css('background-image', 'url('+chrome.extension.getURL('src/inject/logo.png')+')');
				
				// generate content
				if ($target.hasClass('unknown')) {
					$('<div class="unknown">Zatiaľ neevidujeme k&nbsp;používateľovi <strong>'+userName+'</strong> žiadne informácie ani&nbsp;štatistiku.</div>').appendTo($popup);
				}
				else if ($target.hasClass('blank')) {
					$('<div class="blank">K&nbsp;používateľovi evidujeme už&nbsp;<strong>'+parseInt(5+Math.random()*100)+'</strong>&nbsp;príspevkov,<br />ale zatiaľ žiadne nahlásenie.</div>').appendTo($popup);
					$('<div class="button-show-profile">Zobraziť profil</div>').appendTo($popup);
				}
				else {
					var $levels = $('<div class="levels"></div>').appendTo($popup),
						titles = ['Rušenie vecnej diskusie', 'Hrubosť a diskriminácia', 'Nenávisť a útočenie', 'Extrémizmus a trestná činnosť'];
					for (var i=1; i<=4; i++) {
						var value = $target.data('value-'+i);
						$('<div class="level level-'+i+'"><div class="count">'+parseInt(3+value*Math.random(1))+'x</div><h2>'+titles[i-1]+'</h2><div class="track"><span class="value"></span></div></div>')
							.appendTo($levels)
							.find('.value')
							.css('width', value+'%' );
					}
				}
				
				// report button
				$('<div class="report"><p>Chcete tento príspevok nahlásiť?</p><div class="button">Nahlásiť</div></div>').appendTo($popup);
				
				$popup.insertAfter($target);
			}
			
			setTimeout(function(){ $popup.removeClass('hidden'); }, 10 );
		}
		
		function hidePopup(e) {
			isShowingPopup = false;
			setTimeout(function(){
				if (!isShowingPopup) {
					if ($popup) {
						$popup.remove();
						$popup = null;
					}
				}
			}, 500);
		}

	}
	}, 10);	
});