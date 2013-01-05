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
      //SHOW
      $(this).children('div.bottom_level_nav').fadeIn();
      $(this).addClass("top_level_selected");

      if(followURL && $(this).children('a').length != 0)
      {
        //There is no sub menu so follow link
        window.location = $(this).children('a').attr('href');
      }
    }
    else
    {
      //HIDE
      $(this).children('div.bottom_level_nav').hide();
      $(this).removeClass("top_level_selected");
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
      $(this).addClass("bot_level_selected");

      //Determine URL location from the child element
      if(followURL==true)
        window.location = $(this).children('a').attr('href');
    }
    else
    {
      $(this).removeClass("bot_level_selected");
    }
  });
}

$(document).ready(function() 
{
  $('#top_level_nav > li').click(function()
  {
    //Set this and request that we follow URLs
    uuuMenuTopLevelSelect.call($(this),true);
  });

  $('#top_level_nav > li > div.bottom_level_nav > ul > li').click(function()
  {
    //Set this and request that we follow URLs
    uuuMenuBotLevelSelect.call($(this),true);
  });

});
