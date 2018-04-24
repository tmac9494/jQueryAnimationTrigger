$(document).ready(function() {
	//-----------------------------run animations when scrolled to element

	//animations object
	$tAnimationItems = [
		// possible html attributes to set on each element for individual customization:
		//  --data-direct='up,left,right, or down'; -set on .t-fade-in elements to specify direction(defaults to 'up')
		//  --data-speed=(ex: '.75s'); -sets animation speed for specific element(defaults to '.85s')
		//  --data-delay=(ex: '2'); -sets delay for element, uses just interger and multplies by .35s for ease of use just number the order for the delay
		//using whole numbers or floats

		// example object to set up animation
		// -- set object value to null to use html attribute set values instead with functions above
		//    --possible null values: speed,delay
		// {

		// 	responsive: (bool), --if you wanna activate default responsive styles shown below in tRunAnimations()
		//     -- not required
		//  target: (selector), --query selector for which class or id you wish to trigger the animation on
		//  animation: (keyframe); --name of keyframe animation you want to use on the targeted element
		// 	   -- if using built in fade-ins and fade-directions use 'tDopeFade'   
		//  speed: (string as seconds(ex: .75s)); --speed of keyframe animation
		//  cssTiming: (string as timingfunction(ex: ease,ease-out,ease-in-out));
		//	   -- not required
		//	delay: (string as seconds(ex: .75s)); --delay of function
		//  cssDirection: (string as animation direction(ex: forwards,reverse,infinite)) --css animation direction
		//	   -- not required
		//  cssInitial: (object) 
		//  {
		//  	ex( display: 'block'), --object of css styles to add initially before the animations run
		//  };
		{
			responsive: true,
			target: '.t-fade-in:not(.slider-fade-in)',
			animation:'tDopeFade',
			speed: null,
			cssTiming: 'ease-out',
			delay:  null,
			cssInitial: {opacity: '0'},
			// cssStyleTarget: '.t-fade-in',
		},
		{
			responsive:true,
			target: '.flip-in-right',
			animation: 'flip-in-right',
			speed: null,
			delay: null,
			cssInitial: {backfaceVisibility: 'hidden',transform:'rotateX(180deg)'},
		},
		{
			responsive:true,
			target: '.flip-in-left',
			animation: 'flip-in-left',
			speed: null,
			delay: null,
			cssInitial: {backfaceVisibility: 'hidden',transform:'rotateX(-180deg)'},
		}
	];

	//attribute setter functions
	// --add specified attribute to the html element you are animating to get the specified result

	//set fade direction on fade-in animations using data-direct attr
	function tFadeDirection(element) {
		if ($(element).attr('data-direct')) {
			return $(element).attr('data-direct');
		} else {
			return 'up'
		}
	}

	//set speed of animation using data-speed attr
	function tAnimationSpeed(element) {
		if ($(element).attr('data-speed')) {
			return $(element).attr('data-speed');
		} else {
			return '.85s'
		}
	}

	//set animation delay using data-delay attr
	function tAnimationDelay(element) {
		if ($(element).attr('data-delay')) {
			return '' + $(element).attr('data-delay') * .35 + 's' ;
		} else {
			return '0s';
		}
	}

	function tRunAnimations() {
		//loop through array of animation objects to get data
		$.each($tAnimationItems,function(i,anObject) {
			//loop through each html target in each object
			$(anObject.target).each(function(index,animationTarget) {
				//dynamic values for specific attributes and syles
				$newAnimation = false;
				$newSpeed = false;
				$newDelay = false;
				$initialStyles = false;
				//loop through current object to get animation info
				$.each(anObject,function(attrName,attrVal) {
					//run attrubute setter functions for null values
					if (attrVal === null) {
						//set delay
						if (attrName == 'delay') {$newDelay = tAnimationDelay(animationTarget);
						//set speed
						} else if (attrName == 'speed') { $newSpeed = tAnimationSpeed(animationTarget); }
					}
					//set fade direction for fade-ins ??do this better
					if (attrVal == 'tDopeFade') { $newAnimation = "fade-" + tFadeDirection(animationTarget); }
					//set mobile values if animation is responsive
					if (anObject.responsive) {
						if ($(window).width() < 768) {
							//set responsive rules (is there a better way?? 8-/ )
							//set delay
							if (attrName == 'delay') {$newDelay = '0s';}
						}
					}
				});
				//check if cssInitial is set on object and apply if true
				if (anObject.cssInitial) {
					$(animationTarget).css(anObject.cssInitial);
					console.log(anObject.target);
				}
				//check each target for their window position and set animation if the meet the position threshold
				checkFadeTrigger(animationTarget,
					//animation created from animation object and attrubute setter functions
					''+($newAnimation || anObject.animation)
					+' '+($newSpeed || anObject.speed)
					+' '+(anObject.cssTiming || 'ease')
					+' '+($newDelay || anObject.delay)
					+' '+(anObject.cssDirection || 'forwards'));
			});
		});
	}
	//set offset values from top of document on animation targets
	function tSetOffsetAttribute(query) {
		$(query).each(function() {
			$(this).attr('data-offset', Math.floor($(this).offset().top - $animationThresh));	
		});
	}
	//if div offset value meets threshold - apply css animation
	function checkFadeTrigger(div, animation) {
		if (!$(div).hasClass('t-animated')) {
			if ($(div).attr('data-offset') <= $tWindowPosition || $(window).scrollTop() + $(window).height() == $(document).height()) {
				$(div).css('animation', animation).addClass('t-animated');
			}
		}
	}

	//active code:

	//threshold for animations to fire relative to screen height
	$animationThresh = $(window).height() / 1.1;
	$animationTargets = '';
	//create list of selectors from animation object targets
	$.each($tAnimationItems, function(i,object) {
		if ($animationTargets === '') {$animationTargets = object.target;
		} else {$animationTargets = $animationTargets + ', ' + object.target; }
	});

	//set data attribute of distance from top for every animation 
	tSetOffsetAttribute($animationTargets);
	//reset offset attribute on resize
	$(window).resize(function() {tSetOffsetAttribute($animationTargets);});
	//set again after page fully loads && run animation function for element that will be visible on page load
	$(window).on('load', function() {
		tSetOffsetAttribute($animationTargets);
		$tWindowPosition = Math.floor($(document).scrollTop());
		tRunAnimations();
	});

	$(document).scroll(function() {
	//set window position
	$tWindowPosition = Math.floor($(document).scrollTop());
	tRunAnimations();
	});
});