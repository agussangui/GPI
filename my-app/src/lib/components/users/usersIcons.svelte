<script>
    let { users} = $props();
</script>
<div class="avatar-group -space-x-2.5 overflow-visible">
    {#each users as m}
      <div class="tooltip-container">
        <div class="rounded-full w-8 h-8 flex items-center justify-center text-white"
        style="background-color: hsl({m.user_name.charCodeAt(0) * 10 % 360}, 70%, 50%)">
        {m.user_name[0].toUpperCase()+ m.user_name[1]?.toUpperCase()}
      </div>
        <div class="tooltip-text">{m.user_name}</div>
      </div>
      
    {/each}
  </div>

  <style>
    .tooltip-container {
      position: relative;
      display: inline-block;
    }
  
    .tooltip-text {
      visibility: hidden;
      background-color: rgba(0, 0, 0, 0.9);
      color: #fff;
      text-align: center;
      padding: 5px 8px;
      border-radius: 4px;
      position: absolute;
      bottom: 110%;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      opacity: 0;
      font-size: 0.75rem;
    }
  
    .tooltip-container:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }
  </style>