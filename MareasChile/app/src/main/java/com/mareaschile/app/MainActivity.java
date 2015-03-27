package com.mareaschile.app;

import android.app.ProgressDialog;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.JsonHttpResponseHandler;

import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;


public class MainActivity extends ActionBarActivity implements View.OnClickListener, AdapterView.OnItemClickListener {
    private static final String QUERY_BASE = "http://api.mareaschile.com";
    private static final String END_LOCATION = "/localidades";
    private static final String END_TIDES = "/mareas";
    //private Button mainButton;
    //private EditText mainEditText;
    //private ListView mainListView;
    private JSONAdapter mJSONAdapter;
    //private ArrayList mNameList;
    private ProgressDialog mDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //Setting loading
        mDialog = new ProgressDialog(this);
        mDialog.setMessage("Cargando localidades");
        mDialog.setCancelable(false);

        //Load list locations
        //getLocations();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onClick(View v) {

    }

    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {

    }

    /*
    *
    * Metodos personalizados
    *
     */
    private void getLocations() {
        //Show loading
        mDialog.show();
        // Create a client to perform networking
        AsyncHttpClient client = new AsyncHttpClient();

        // Have the client get a JSONArray of data
        // and define how to respond
        client.get(QUERY_BASE + END_LOCATION,
            new JsonHttpResponseHandler() {

                @Override
                public void onSuccess(JSONObject jsonObject) {
                    mDialog.dismiss();
                    // Display a "Toast" message
                    // to announce your success
                    //Toast.makeText(getApplicationContext(), "Success!", Toast.LENGTH_LONG).show();

                    // 8. For now, just log results
                    Log.d("omg", jsonObject.toString());

                    // update the data in your custom method.
                    //mJSONAdapter.updateData(jsonObject.optJSONArray("docs"));
                }

                @Override
                public void onFailure(int statusCode, Throwable throwable, JSONObject error) {
                    Log.d("omg", "Error: " + statusCode + " " + throwable.getMessage());
                    mDialog.dismiss();
                    // Display a "Toast" message
                    // to announce the failure
                    Toast.makeText(getApplicationContext(), "Error: " + statusCode + " " + throwable.getMessage(), Toast.LENGTH_LONG).show();

                    // Log error message
                    // to help solve any problems
                    //Log.e("omg android", statusCode + " " + throwable.getMessage());
                }
            });
    }

    /*
    private void queryTides(String searchString) {

        // Prepare your search string to be put in a URL
        // It might have reserved characters or something
        String urlString = "";
        try {
            urlString = URLEncoder.encode(searchString, "UTF-8");
        } catch (UnsupportedEncodingException e) {

            // if this fails for some reason, let the user know why
            e.printStackTrace();
            Toast.makeText(this, "Error: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }

        // Create a client to perform networking
        AsyncHttpClient client = new AsyncHttpClient();

        mDialog.show();
        // Have the client get a JSONArray of data
        // and define how to respond
        client.get(QUERY_URL + urlString,
                new JsonHttpResponseHandler() {

                    @Override
                    public void onSuccess(JSONObject jsonObject) {
                        mDialog.dismiss();
                        // Display a "Toast" message
                        // to announce your success
                        Toast.makeText(getApplicationContext(), "Success!", Toast.LENGTH_LONG).show();

                        // 8. For now, just log results
                        //Log.d("omg android", jsonObject.toString());

                        // update the data in your custom method.
                        mJSONAdapter.updateData(jsonObject.optJSONArray("docs"));
                    }

                    @Override
                    public void onFailure(int statusCode, Throwable throwable, JSONObject error) {
                        mDialog.dismiss();
                        // Display a "Toast" message
                        // to announce the failure
                        Toast.makeText(getApplicationContext(), "Error: " + statusCode + " " + throwable.getMessage(), Toast.LENGTH_LONG).show();

                        // Log error message
                        // to help solve any problems
                        //Log.e("omg android", statusCode + " " + throwable.getMessage());
                    }
                });
    }
    */
}
