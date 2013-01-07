/* Regular Expression escape function */
RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};

function uuuMenuSetBreadcrumbs(topLevel,botLevel)
{
  if(typeof topLevel != "string")
    console.error("First argument invalid");
  if(typeof botLevel != "string" && botLevel != null)
    console.error("Second argument invalid");

  $("#top_level_nav").children('li').each(function(index)
  {
    var text=$(this).get(0).firstChild.textContent;

    //Try to do regex match. We assume we don't need to escape text
    if( text.match(new RegExp("^\s*" + RegExp.escape(topLevel))) != null)
    {
      //found top level match
      uuuMenuTopLevelSelect.call($(this),false);

      if(botLevel != null)
      {
        $(this).find('li').each(function(index)
        {
          var text=$(this).get(0).firstChild.textContent;

          //Try to do regex match. We assume we don't need to escape text
          if(text.match(new RegExp("^\s*" + RegExp.escape(botLevel))) != null)
          {
            uuuMenuBotLevelSelect.call($(this),false);
            return false; //Stop loop
          }
        });
      }

      return false; //Stop loop
    }
  });
}

/*
this needs to be set to the li element clicked on
*/
function uuuMenuTopLevelSelect(followURL)
{
  var clicked=$(this);

  $(this).parent().children('li').each(function(index)
  {
    if($(this).get(0) == clicked.get(0))
    {
      //Show bottom level menu options
      $(this).children('div.bottom_level_nav').fadeIn();
      $(this).addClass("top_level_selected");

      //Remove hover behaviour, because it's selected
      $(this).unbind('mouseenter mouseleave');
      $(this).removeClass('top_level_hover');

      //The Bottom level menu we just showed needs hover behaviour
      $(this).children('div.bottom_level_nav').children('ul').children('li').each(function(index)
      {
        uuuMenuBotLevelAddHover.call(this);
      }
      );

      if(followURL && $(this).children('a').length != 0)
      {
        //There is no sub menu so follow link
        window.location = $(this).children('a').attr('href');
      }

    }
    else
    {
      //Hide bottom level menu options
      $(this).children('div.bottom_level_nav').hide();
      $(this).removeClass("top_level_selected");

      //add hover behaviour, because it's not selected
      $(this).hover(function()
      {
        $(this).addClass('top_level_hover');
      },
      function()
      {
        $(this).removeClass('top_level_hover');
      }
      );
    }
  }
  );
}

/*
this needs to be set to the li element clicked on
*/
function uuuMenuBotLevelSelect(followURL)
{
  var clicked=$(this);

  $(this).parent().children('li').each(function(index)
  {
    if($(this).get(0) == clicked.get(0))
    {
      //Element selected
      $(this).addClass("bot_level_selected");

      //Remove hover behaviour, because it's selected
      $(this).unbind('mouseenter mouseleave');
      $(this).removeClass('bot_level_hover');

      //Determine URL location from the child element
      if(followURL==true)
        window.location = $(this).children('a').attr('href');

    }
    else
    {
      //Unselect element
      $(this).removeClass("bot_level_selected");

      //add hover behaviour, because it's not selected
      uuuMenuBotLevelAddHover.call(this);
    }
  });
}

/* This needs to be set to an li element in the bottom menu */
function uuuMenuBotLevelAddHover()
{
  $(this).unbind("mouseenter mouseleave"); //Unbind other handlers (prevents handlers being set multiple times by this function)
  $(this).hover(function()
  {
    $(this).addClass('bot_level_hover');
  },
  function()
  {
    $(this).removeClass('bot_level_hover');
  }
  );
}

$(document).ready(function() 
{
  $('#top_level_nav > li').click(function()
  {
    //Set this and request that we follow URLs
    uuuMenuTopLevelSelect.call($(this),true);
  });

  $('#top_level_nav > li > div.bottom_level_nav > ul > li').click(function(event)
  {
    //Set this and request that we follow URLs
    uuuMenuBotLevelSelect.call($(this),true);
    /* Due to the nesting of menu elements the top level nav click can be triggered
      by clicking on bottom level menu elements. We don't want this so we try to 
      stop the event being propogated and ASSUME that the most nested event (i.e. this one)
      gets called first.
    */
    event.stopImmediatePropagation();
  });

});
